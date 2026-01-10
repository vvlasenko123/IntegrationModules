using Api.Controllers.Models.Request.Sticker;
using Api.Controllers.Models.Response.Sticker;
using Dal.Repository.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// контроллер со стикерами
/// </summary>
[ApiController]
[Route("api/v1/stickers")]
public sealed class StickerController : ControllerBase
{
    private readonly ILogger<StickerController> _logger;
    private readonly IStickerRepository _stickerRepository;

    public StickerController(
        ILogger<StickerController> logger,
        IStickerRepository stickerRepository)
    {
        _logger = logger;
        _stickerRepository = stickerRepository;
    }

    /// <summary>
    /// Получение списка доступных стикеров
    /// </summary>
    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyCollection<StickerResponse>>> GetAllAsync(CancellationToken token)
    {
        var stickers = await _stickerRepository.GetAllAsync(token);

        var result = stickers.Select(x => new StickerResponse
        {
            Id = x.Id,
            Name = x.Name
        });

        return Ok(result);
    }

    /// <summary>
    /// Получение стикера по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StickerResponse>> GetByIdAsync([FromRoute] Guid id, CancellationToken token)
    {
        var sticker = await _stickerRepository.GetByIdAsync(id, token);

        if (sticker is null)
        {
            return NotFound("Стикер не найден");
        }

        return Ok(new StickerResponse
        {
            Id = sticker.Id,
            Name = sticker.Name
        });
    }

    /// <summary>
    /// Добавление стикера на доску
    /// </summary>
    [HttpPost("board")]
    public async Task<ActionResult<BoardStickerResponse>> AddToBoardAsync(
        [FromBody] AddBoardStickerRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        if (request.StickerId == Guid.Empty)
        {
            return BadRequest("StickerId не задан");
        }

        var created = await _stickerRepository.AddToBoardAsync(
            request.StickerId,
            request.Width,
            request.Height,
            token);

        _logger.LogInformation("Стикер добавлен на доску: {BoardStickerId}", created.Id);

        return Ok(new BoardStickerResponse
        {
            Id = created.Id,
            StickerId = created.StickerId,
            Width = created.Width,
            Height = created.Height
        });
    }

    /// <summary>
    /// Получение всех стикеров на доске
    /// </summary>
    [HttpGet("board")]
    public async Task<ActionResult<IReadOnlyCollection<BoardStickerResponse>>> GetBoardAsync(CancellationToken token)
    {
        var items = await _stickerRepository.GetBoardAsync(token);

        var result = items.Select(x => new BoardStickerResponse
        {
            Id = x.Id,
            StickerId = x.StickerId,
            Width = x.Width,
            Height = x.Height
        });

        return Ok(result);
    }

    /// <summary>
    /// Получение стикера на доске по идентификатору размещения
    /// </summary>
    [HttpGet("board/{id:guid}")]
    public async Task<ActionResult<BoardStickerResponse>> GetBoardByIdAsync([FromRoute] Guid id, CancellationToken token)
    {
        var item = await _stickerRepository.GetBoardByIdAsync(id, token);

        if (item is null)
        {
            return NotFound("Стикер на доске не найден");
        }

        return Ok(new BoardStickerResponse
        {
            Id = item.Id,
            StickerId = item.StickerId,
            Width = item.Width,
            Height = item.Height
        });
    }

    /// <summary>
    /// Изменение размеров и поворота стикера на доске
    /// </summary>
    [HttpPatch("board/{id:guid}/transform")]
    public async Task<ActionResult<BoardStickerResponse>> UpdateBoardTransformAsync(
        [FromRoute] Guid id,
        [FromBody] BoardStickerUpdateSizeRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _stickerRepository.UpdateBoardTransformAsync(
            id,
            request.Width,
            request.Height,
            token);

        if (updated is null)
        {
            return NotFound("Стикер на доске не найден");
        }

        return Ok(new BoardStickerResponse
        {
            Id = updated.Id,
            StickerId = updated.StickerId,
            Width = updated.Width,
            Height = updated.Height
        });
    }

    /// <summary>
    /// Удаление стикера с доски
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id, CancellationToken token)
    {
        var deleted = await _stickerRepository.DeleteAsync(id, token);

        if (!deleted)
        {
            return NotFound("Стикер на доске не найден");
        }

        _logger.LogInformation("Стикер удален с доски: {BoardStickerId}", id);

        return NoContent();
    }
}
