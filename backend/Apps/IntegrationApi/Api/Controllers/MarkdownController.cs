using Api.Controllers.Models.Request.Markdown;
using Api.Controllers.Models.Response.Markdown;
using Dal.Models.Markdown;
using Dal.Repository.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// контроллер с markdown
/// </summary>
[ApiController]
[Route("api/v1/markdown")]
public sealed class MarkdownController : ControllerBase
{
    private readonly ILogger<MarkdownController> _logger;
    private readonly IMarkdownRepository _markdownRepository;

    public MarkdownController(ILogger<MarkdownController> logger, IMarkdownRepository markdownRepository)
    {
        _logger = logger;
        _markdownRepository = markdownRepository;
    }

    /// <summary>
    /// Создание markdown
    /// </summary>
    [HttpPost("create")]
    public async Task<ActionResult<MarkdownResponse>> CreateAsync([FromBody] MarkdownRequest? request, CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var markdown = new Markdown
        {
            Content = request.Content ?? string.Empty,
            Width = request.Width,
            Height = request.Height
        };

        var created = await _markdownRepository.CreateAsync(markdown, token);

        _logger.LogInformation("Markdown создан: {MarkdownId}", created.Id);

        return Ok(new MarkdownResponse
        {
            Id = created.Id,
            Content = created.Content,
            Width = created.Width,
            Height = created.Height
        });
    }

    /// <summary>
    /// Получение markdown по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MarkdownResponse>> GetByIdAsync([FromRoute] Guid id, CancellationToken token)
    {
        var markdown = await _markdownRepository.GetByIdAsync(id, token);

        if (markdown is null)
        {
            return NotFound("Markdown не найден");
        }

        return Ok(new MarkdownResponse
        {
            Id = markdown.Id,
            Content = markdown.Content,
            Width = markdown.Width,
            Height = markdown.Height
        });
    }

    /// <summary>
    /// Получение списка markdown
    /// </summary>
    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyCollection<MarkdownResponse>>> GetAllAsync(CancellationToken token)
    {
        var items = await _markdownRepository.GetAllAsync(token);

        var result = items.Select(x => new MarkdownResponse
        {
            Id = x.Id,
            Content = x.Content,
            Width = x.Width,
            Height = x.Height
        }).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Обновление текста markdown
    /// </summary>
    [HttpPatch("{id:guid}/content")]
    public async Task<ActionResult<MarkdownResponse>> UpdateContentAsync(
        [FromRoute] Guid id,
        [FromBody] MarkdownUpdateContentRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _markdownRepository.UpdateContentAsync(id, request.Content ?? string.Empty, token);

        if (updated is null)
        {
            return NotFound("Markdown не найден");
        }

        return Ok(new MarkdownResponse
        {
            Id = updated.Id,
            Content = updated.Content,
            Width = updated.Width,
            Height = updated.Height
        });
    }

    /// <summary>
    /// Изменение размера markdown
    /// </summary>
    [HttpPatch("{id:guid}/size")]
    public async Task<ActionResult<MarkdownResponse>> UpdateSizeAsync(
        [FromRoute] Guid id,
        [FromBody] MarkdownUpdateSizeRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _markdownRepository.UpdateSizeAsync(id, request.Width, request.Height, token);

        if (updated is null)
        {
            return NotFound("Markdown не найден");
        }

        return Ok(new MarkdownResponse
        {
            Id = updated.Id,
            Content = updated.Content,
            Width = updated.Width,
            Height = updated.Height
        });
    }

    /// <summary>
    /// Удаление markdown
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id, CancellationToken token)
    {
        var deleted = await _markdownRepository.DeleteAsync(id, token);

        if (!deleted)
        {
            return NotFound("Markdown не найден");
        }

        _logger.LogInformation("Markdown удален: {MarkdownId}", id);

        return NoContent();
    }
    
    /// <summary>
    /// Добавление маркдауна на доску
    /// </summary>
    [HttpPost("board")]
    public async Task<ActionResult<BoardMarkdownResponse>> AddToBoardAsync(
        [FromBody] AddBoardMarkdownRequest request,
        CancellationToken token)
    {
        if (request.MarkdownId == Guid.Empty)
        {
            return BadRequest("MarkdownId не задан");
        }

        var markdown = await _markdownRepository.GetByIdAsync(request.MarkdownId, token);

        if (markdown is null)
        {
            return NotFound("Markdown не найден");
        }

        var created = await _markdownRepository.AddToBoardAsync(
            request.MarkdownId,
            request.Width,
            request.Height,
            token);

        return Ok(new BoardMarkdownResponse
        {
            Id = created.Id,
            MarkdownId = created.MarkdownId,
            Width = created.Width,
            Height = created.Height,
            Content = markdown.Content,
            IsEditorVisible = created.IsEditorVisible,
        });
    }

    /// <summary>
    /// Получение доски
    /// </summary>
    [HttpGet("board")]
    public async Task<ActionResult<IReadOnlyCollection<BoardMarkdownResponse>>> GetBoardAsync(CancellationToken token)
    {
        var board = await _markdownRepository.GetBoardAsync(token);
        var markdowns = await _markdownRepository.GetAllAsync(token);

        var byId = markdowns.ToDictionary(x => x.Id, x => x);

        var result = board.Select(x =>
        {
            byId.TryGetValue(x.MarkdownId, out var md);

            return new BoardMarkdownResponse
            {
                Id = x.Id,
                MarkdownId = x.MarkdownId,
                Width = x.Width,
                Height = x.Height,
                Content = md?.Content ?? string.Empty,
                IsEditorVisible = x.IsEditorVisible,
            };
        }).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Изменение размера маркдауна на доске
    /// </summary>
    [HttpPatch("board/{id:guid}/size")]
    public async Task<ActionResult<BoardMarkdownResponse>> UpdateBoardSizeAsync(
        [FromRoute] Guid id,
        [FromBody] MarkdownUpdateSizeRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _markdownRepository.UpdateBoardSizeAsync(id, request.Width, request.Height, token);

        if (updated is null)
        {
            return NotFound("Markdown на доске не найден");
        }

        var markdown = await _markdownRepository.GetByIdAsync(updated.MarkdownId, token);

        return Ok(new BoardMarkdownResponse
        {
            Id = updated.Id,
            MarkdownId = updated.MarkdownId,
            Width = updated.Width,
            Height = updated.Height,
            Content = markdown?.Content ?? string.Empty,
            IsEditorVisible = updated.IsEditorVisible,
        });
    }

    /// <summary>
    /// Удаление маркдауна с доски
    /// </summary>
    [HttpDelete("board/{id:guid}")]
    public async Task<IActionResult> DeleteBoardAsync([FromRoute] Guid id, CancellationToken token)
    {
        var deleted = await _markdownRepository.DeleteBoardAsync(id, token);

        if (!deleted)
        {
            return NotFound("Markdown на доске не найден");
        }

        return NoContent();
    }
    
    /// <summary>
    /// Обновление состояния маркдауна
    /// </summary>
    [HttpPatch("board/{id:guid}/editor")]
    public async Task<ActionResult<BoardMarkdownResponse>> UpdateBoardEditorStateAsync(
        [FromRoute] Guid id,
        [FromBody] BoardMarkdownUpdateEditorStateRequest? request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _markdownRepository.UpdateBoardEditorStateAsync(id, request.IsEditorVisible, token);

        if (updated is null)
        {
            return NotFound("Markdown на доске не найден");
        }

        var markdown = await _markdownRepository.GetByIdAsync(updated.MarkdownId, token);

        return Ok(new BoardMarkdownResponse
        {
            Id = updated.Id,
            MarkdownId = updated.MarkdownId,
            Width = updated.Width,
            Height = updated.Height,
            IsEditorVisible = updated.IsEditorVisible,
            Content = markdown?.Content ?? string.Empty
        });
    }
}