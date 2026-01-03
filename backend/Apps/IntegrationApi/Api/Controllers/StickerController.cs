using Api.Controllers.Models.Request.Sticker;
using Api.Controllers.Models.Response.Sticker;
using Dal.Repository.interfaces;
using InfraLib.Minio;
using InfraLib.MinIO.Storage;
using Logic.Services.Cache.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;

namespace Api.Controllers;

/// <summary>
/// контроллер со стикерами
/// </summary>
[ApiController]
[Route("api/v1/stickers")]
public sealed class StickerController : ControllerBase
{
    private static readonly HttpClient Http = new();
    private readonly ILogger<StickerController> _logger;
    private readonly IStickerRepository _stickerRepository;
    private readonly MinioImageStorage _storage;
    private readonly IDistributedCache _cache;

    public StickerController(
        IStickerRepository stickerRepository,
        MinioImageStorage storage,
        IDistributedCache cache,
        ILogger<StickerController> logger)
    {
        _stickerRepository = stickerRepository;
        _storage = storage;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Загрузка стикеров
    /// </summary>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<IReadOnlyCollection<StickerResponse>>> UploadAsync(
        [FromForm(Name = "files")] List<IFormFile>? files,
        CancellationToken token)
    {
        if (files is null || files.Count == 0)
        {
            return BadRequest("Файлы не переданы");
        }

        foreach (var file in files)
        {
            if (file is null)
            {
                return BadRequest("Один из файлов не задан");
            }

            if (file.Length <= 0)
            {
                return BadRequest("Один из файлов пустой");
            }
        }

        var result = await _stickerRepository.UploadAsync(files, _storage, token);

        await _cache.RemoveAsync(MinIOCacheHelper.StickersCacheKey, token);

        _logger.LogInformation("Загружено стикеров: {Count}", result.Count);

        return Ok(result);
    }

    /// <summary>
    /// Получение списка стикеров
    /// </summary>
    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyCollection<StickerResponse>>> GetAllAsync(CancellationToken token)
    {
        var items = await MinIOCacheHelper.GetOrSetCachedItemsAsync(
            _cache,
            async (ct) =>
            {
                var stickers = await _stickerRepository.GetAllAsync(ct);

                return stickers.Select(x => new StickerCacheItem
                {
                    Id = x.Id,
                    StoragePath = x.StoragePath,
                    Width = x.Width,
                    Height = x.Height
                }).ToList();
            },
            token);

        var result = items.Select(x => new StickerResponse
        {
            Id = x.Id,
            StoragePath = x.StoragePath,
            Url = $"/api/v1/stickers/{x.Id:D}/file",
            Width = x.Width,
            Height = x.Height
        });

        return Ok(result);
    }

    /// <summary>
    /// Получение файла стикера (бэк проксирует MinIO)
    /// </summary>
    [HttpGet("{id:guid}/file")]
    public async Task<IActionResult> GetFileAsync([FromRoute] Guid id, CancellationToken token)
    {
        var items = await MinIOCacheHelper.GetOrSetCachedItemsAsync(
            _cache,
            async (ct) =>
            {
                var stickers = await _stickerRepository.GetAllAsync(ct);

                return stickers.Select(x => new StickerCacheItem
                {
                    Id = x.Id,
                    StoragePath = x.StoragePath,
                    Width = x.Width,
                    Height = x.Height
                }).ToList();
            },
            token);

        var item = items.FirstOrDefault(x => x.Id == id);

        if (item is null)
        {
            return NotFound("Стикер не найден");
        }

        var presigned = await _storage.GetDownloadUrlAsync(item.StoragePath, expirySeconds: 60 * 15, token);

        using var response = await Http.GetAsync(presigned, token);

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, "Не удалось получить файл из хранилища");
        }

        var bytes = await response.Content.ReadAsByteArrayAsync(token);
        var contentType = response.Content.Headers.ContentType?.ToString();

        if (string.IsNullOrWhiteSpace(contentType))
        {
            contentType = "application/octet-stream";
        }

        return File(bytes, contentType);
    }

    /// <summary>
    /// Удаление стикера по id
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id, CancellationToken token)
    {    
        if (id == Guid.Empty)
        {
            return BadRequest("Id не задан");
        }

        var affected = await _stickerRepository.DeleteByIdAsync(id, token);

        if (affected <= 0)
        {
            return NotFound("Стикер на доске не найден");
        }

        return NoContent();
    }
    
    /// <summary>
    /// добавление на доску
    /// </summary>
    [HttpPost("board")]
    public async Task<ActionResult<BoardStickerResponse>> AddToBoardAsync(
        [FromBody] AddBoardStickerRequest request,
        CancellationToken token)
    {
        if (request.StickerId == Guid.Empty)
        {
            return BadRequest("StickerId не задан");
        }

        var created = await _stickerRepository.AddToBoardAsync(
            request.StickerId,
            request.Width,
            request.Height,
            token);

        var result = new BoardStickerResponse
        {
            Id = created.Id,
            StickerId = created.StickerId,
            Url = $"/api/v1/stickers/{created.StickerId:D}/file",
            Width = created.Width,
            Height = created.Height
        };

        return Ok(result);
    }
    
    /// <summary>
    /// Получить все эмодзи на доске
    /// </summary>
    [HttpGet("board")]
    public async Task<ActionResult<IReadOnlyCollection<BoardStickerResponse>>> GetBoardAsync(CancellationToken token)
    {
        var boardItems = await _stickerRepository.GetBoardAsync(token);
        var stickers = await _stickerRepository.GetAllAsync(token);

        var sizesByStickerId = stickers.ToDictionary(x => x.Id, x => x);

        var result = boardItems.Select(x =>
        {
            sizesByStickerId.TryGetValue(x.StickerId, out var sticker);

            return new BoardStickerResponse
            {
                Id = x.Id,
                StickerId = x.StickerId,
                Url = $"/api/v1/stickers/{x.StickerId:D}/file",
                Width = x.Width,
                Height = x.Height
            };
        });

        return Ok(result);
    }

    [HttpPatch("board/{id:guid}/size")]
    public async Task<ActionResult<BoardStickerResponse>> UpdateBoardSizeAsync(
        [FromRoute] Guid id,
        [FromBody] BoardStickerUpdateSizeRequest request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _stickerRepository.UpdateBoardSizeAsync(id, request.Width, request.Height, token);

        if (updated is null)
        {
            return NotFound("Стикер на доске не найден");
        }

        return Ok(new BoardStickerResponse
        {
            Id = updated.Id,
            StickerId = updated.StickerId,
            Url = $"/api/v1/stickers/{updated.StickerId:D}/file",
            Width = updated.Width,
            Height = updated.Height
        });
    }
}
