using Api.Controllers.Models.Request.Shape;
using Api.Controllers.Models.Response.Shape;
using Dal.Repository.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Контроллер с фигурами
/// </summary>
[ApiController]
[Route("api/v1/shapes")]
public sealed class ShapeController : ControllerBase
{
    private readonly ILogger<ShapeController> _logger;
    private readonly IShapeRepository _shapeRepository;

    public ShapeController(
        ILogger<ShapeController> logger,
        IShapeRepository shapeRepository)
    {
        _logger = logger;
        _shapeRepository = shapeRepository;
    }

    /// <summary>
    /// Получение списка доступных фигур
    /// </summary>
    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyCollection<ShapeResponse>>> GetAllAsync(CancellationToken token)
    {
        var shapes = await _shapeRepository.GetAllAsync(token);

        var result = shapes.Select(x => new ShapeResponse
        {
            Id = x.Id,
            ShapeId = x.ShapeId
        }).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Получение фигуры по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ShapeResponse>> GetByIdAsync([FromRoute] Guid id, CancellationToken token)
    {
        var shape = await _shapeRepository.GetByIdAsync(id, token);

        if (shape is null)
        {
            return NotFound("Фигура не найдена");
        }

        return Ok(new ShapeResponse
        {
            Id = shape.Id,
            ShapeId = shape.ShapeId
        });
    }

    /// <summary>
    /// Добавление фигуры на доску
    /// </summary>
    [HttpPost("board")]
    public async Task<ActionResult<BoardShapeResponse>> AddToBoardAsync(
        [FromBody] AddBoardShapeRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        if (request.ShapeId == Guid.Empty)
        {
            return BadRequest("ShapeId не задан");
        }

        var created = await _shapeRepository.AddToBoardAsync(
            request.ShapeId,
            request.Width,
            request.Height,
            request.Rotation,
            token);

        _logger.LogInformation("Фигура добавлена на доску: {BoardShapeId}", created.Id);

        return Ok(new BoardShapeResponse
        {
            Id = created.Id,
            ShapeId = created.ShapeId,
            Width = created.Width,
            Height = created.Height,
            Rotation = created.Rotation
        });
    }

    /// <summary>
    /// Получение всех фигур на доске
    /// </summary>
    [HttpGet("board")]
    public async Task<ActionResult<IReadOnlyCollection<BoardShapeResponse>>> GetBoardAsync(CancellationToken token)
    {
        var items = await _shapeRepository.GetBoardAsync(token);

        var result = items.Select(x => new BoardShapeResponse
        {
            Id = x.Id,
            ShapeId = x.ShapeId,
            Width = x.Width,
            Height = x.Height,
            Rotation = x.Rotation
        }).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Получение фигуры на доске по идентификатору размещения
    /// </summary>
    [HttpGet("board/{id:guid}")]
    public async Task<ActionResult<BoardShapeResponse>> GetBoardByIdAsync([FromRoute] Guid id, CancellationToken token)
    {
        var item = await _shapeRepository.GetBoardByIdAsync(id, token);

        if (item is null)
        {
            return NotFound("Фигура на доске не найдена");
        }

        return Ok(new BoardShapeResponse
        {
            Id = item.Id,
            ShapeId = item.ShapeId,
            Width = item.Width,
            Height = item.Height,
            Rotation = item.Rotation
        });
    }

    /// <summary>
    /// Изменение размеров и поворота фигуры на доске
    /// </summary>
    [HttpPatch("board/{id:guid}/transform")]
    public async Task<ActionResult<BoardShapeResponse>> UpdateBoardTransformAsync(
        [FromRoute] Guid id,
        [FromBody] BoardShapeUpdateTransformRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _shapeRepository.UpdateBoardTransformAsync(
            id,
            request.Width,
            request.Height,
            request.Rotation,
            token);

        if (updated is null)
        {
            return NotFound("Фигура на доске не найдена");
        }

        return Ok(new BoardShapeResponse
        {
            Id = updated.Id,
            ShapeId = updated.ShapeId,
            Width = updated.Width,
            Height = updated.Height,
            Rotation = updated.Rotation
        });
    }
}
