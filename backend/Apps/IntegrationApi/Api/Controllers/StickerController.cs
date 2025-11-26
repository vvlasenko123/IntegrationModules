using System.Text.Json;
using Api.Controllers.Models.Response;
using Dal.Repository.interfaces;
using InfraLib.MinIO.Storage;
using InfraLib.Redis.Models;
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
    private const string StickersCacheKey = "stickers:get-all:v1";
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
        await _cache.RemoveAsync(StickersCacheKey, token);

        _logger.LogInformation("Загружено стикеров: {Count}", result.Count);

        return Ok(result);
    }

    /// <summary>
    /// Получение списка стикеров
    /// </summary>
    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyCollection<StickerResponse>>> GetAllAsync(CancellationToken token)
    {
        var cached = await _cache.GetAsync(StickersCacheKey, token);
        List<StickerCacheItem> items;

        if (cached is not null)
        {
            items = JsonSerializer.Deserialize<List<StickerCacheItem>>(cached) ?? new List<StickerCacheItem>(0);
        }
        else
        {
            var stickers = await _stickerRepository.GetAllAsync(token);

            items = stickers.Select(x => new StickerCacheItem
            {
                Id = x.Id,
                StoragePath = x.StoragePath
            }).ToList();

            await _cache.SetAsync(
                StickersCacheKey,
                JsonSerializer.SerializeToUtf8Bytes(items),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
                },
                token);
        }

        var tasks = items.Select(async x =>
        {
            var url = await _storage.GetDownloadUrlAsync(x.StoragePath, expirySeconds: 60 * 15, token);

            return new StickerResponse
            {
                Id = x.Id,
                StoragePath = x.StoragePath,
                Url = url
            };
        });

        var result = await Task.WhenAll(tasks);

        return Ok(result);
    }
}
