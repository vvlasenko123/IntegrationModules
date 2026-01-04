using Api.Controllers.Models.Request.Roadmap;
using Api.Controllers.Models.Response.Roadmap;
using Dal.Models.Roadmap;
using Dal.Repository.interfaces.Roadmap;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Котроллер для roadmap
/// </summary>
[ApiController]
[Route("api/v1/roadmap")]
public sealed class RoadmapController : ControllerBase
{
    private readonly ILogger<RoadmapController> _logger;
    private readonly IRoadmapRepository _roadmapRepository;

    public RoadmapController(ILogger<RoadmapController> logger, IRoadmapRepository roadmapRepository)
    {
        _logger = logger;
        _roadmapRepository = roadmapRepository;
    }

    /// <summary>
    /// Создание элемента roadmap
    /// </summary>
    [HttpPost("create")]
    public async Task<ActionResult<RoadmapItemResponse>> CreateAsync([FromBody] RoadmapItemCreateRequest? request, CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var item = new RoadmapItem
        {
            Text = request.Text ?? string.Empty,
            Description = request.Description ?? string.Empty,
            Date = request.Date,
            Completed = request.Completed ?? false,
            Cancelled = request.Cancelled ?? false,
            ZIndex = request.ZIndex ?? 0,
            Width = request.Width ?? 200,
            Height = request.Height ?? 120,
            ParentId = request.ParentId
        };

        var created = await _roadmapRepository.CreateAsync(item, token);

        _logger.LogInformation("Roadmap элемент создан: {RoadmapId}", created.Id);

        return Ok(ToResponse(created));
    }

    /// <summary>
    /// Получение элемента roadmap по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RoadmapItemResponse>> GetByIdAsync([FromRoute] Guid id, CancellationToken token)
    {
        var item = await _roadmapRepository.GetByIdAsync(id, token);

        if (item is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(item));
    }

    /// <summary>
    /// Получение списка элементов roadmap
    /// </summary>
    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyCollection<RoadmapItemResponse>>> GetAllAsync(CancellationToken token)
    {
        var items = await _roadmapRepository.GetAllAsync(token);

        var result = items.Select(ToResponse);

        return Ok(result);
    }

    /// <summary>
    /// Обновление текста
    /// </summary>
    [HttpPatch("{id:guid}/text")]
    public async Task<ActionResult<RoadmapItemResponse>> UpdateTextAsync(
        [FromRoute] Guid id,
        [FromBody] RoadmapUpdateTextRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _roadmapRepository.UpdateTextAsync(id, request.Text ?? string.Empty, token);

        if (updated is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(updated));
    }

    /// <summary>
    /// Обновление описания
    /// </summary>
    [HttpPatch("{id:guid}/description")]
    public async Task<ActionResult<RoadmapItemResponse>> UpdateDescriptionAsync(
        [FromRoute] Guid id,
        [FromBody] RoadmapUpdateDescriptionRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _roadmapRepository.UpdateDescriptionAsync(id, request.Description ?? string.Empty, token);

        if (updated is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(updated));
    }

    /// <summary>
    /// Обновление даты (и completed вместе с ней)
    /// </summary>
    [HttpPatch("{id:guid}/date")]
    public async Task<ActionResult<RoadmapItemResponse>> UpdateDateAsync(
        [FromRoute] Guid id,
        [FromBody] RoadmapUpdateDateRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _roadmapRepository.UpdateDateAsync(id, request.Date, request.Completed, token);

        if (updated is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(updated));
    }

    /// <summary>
    /// Обновление completed
    /// </summary>
    [HttpPatch("{id:guid}/completed")]
    public async Task<ActionResult<RoadmapItemResponse>> UpdateCompletedAsync(
        [FromRoute] Guid id,
        [FromBody] RoadmapUpdateCompletedRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _roadmapRepository.UpdateCompletedAsync(id, request.Completed, token);

        if (updated is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(updated));
    }

    /// <summary>
    /// Обновление cancelled
    /// </summary>
    [HttpPatch("{id:guid}/cancelled")]
    public async Task<ActionResult<RoadmapItemResponse>> UpdateCancelledAsync(
        [FromRoute] Guid id,
        [FromBody] RoadmapUpdateCancelledRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _roadmapRepository.UpdateCancelledAsync(id, request.Cancelled, token);

        if (updated is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(updated));
    }

    /// <summary>
    /// Обновление z-index
    /// </summary>
    [HttpPatch("{id:guid}/z-index")]
    public async Task<ActionResult<RoadmapItemResponse>> UpdateZIndexAsync(
        [FromRoute] Guid id,
        [FromBody] RoadmapUpdateZIndexRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _roadmapRepository.UpdateZIndexAsync(id, request.ZIndex, token);

        if (updated is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(updated));
    }

    /// <summary>
    /// Обновление размера
    /// </summary>
    [HttpPatch("{id:guid}/size")]
    public async Task<ActionResult<RoadmapItemResponse>> UpdateSizeAsync(
        [FromRoute] Guid id,
        [FromBody] RoadmapUpdateSizeRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _roadmapRepository.UpdateSizeAsync(id, request.Width, request.Height, token);

        if (updated is null)
        {
            return NotFound("Элемент roadmap не найден");
        }

        return Ok(ToResponse(updated));
    }

    /// <summary>
    /// Удаление элемента roadmap
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id, CancellationToken token)
    {
        var deleted = await _roadmapRepository.DeleteAsync(id, token);

        if (!deleted)
        {
            return NotFound("Элемент roadmap не найден");
        }

        _logger.LogInformation("Roadmap элемент удален: {RoadmapId}", id);

        return NoContent();
    }

    /// <summary>
    /// Маппинг RoadmapItem
    /// </summary>
    private static RoadmapItemResponse ToResponse(RoadmapItem item)
    {
        return new RoadmapItemResponse
        {
            Id = item.Id,
            Text = item.Text,
            Description = item.Description,
            Date = item.Date,
            Completed = item.Completed,
            Cancelled = item.Cancelled,
            ZIndex = item.ZIndex,
            Width = item.Width,
            Height = item.Height,
            ParentId = item.ParentId
        };
    }
}
