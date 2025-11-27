using Api.Controllers.Models.Request;
using Api.Controllers.Models.Response;
using Dal.Models.Notes;
using Dal.Repository.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// контроллер с заметками
/// </summary>
[ApiController]
[Route("api/v1/note")]
public class NoteController : ControllerBase
{
    private readonly ILogger<NoteController> _logger;
    private readonly INoteRepository _noteRepository;

    public NoteController(ILogger<NoteController> logger, INoteRepository noteRepository)
    {
        _logger = logger;
        _noteRepository = noteRepository;
    }

    /// <summary>
    /// Создание заметки
    /// </summary>
    [HttpPost("create")]
    public async Task<ActionResult<NoteResponse>> CreateAsync([FromBody] NoteRequest request, CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        if (request.Color is null || string.IsNullOrWhiteSpace(request.Color))
        {
            return BadRequest("Поле color не задано");
        }

        var note = new Note
        {
            Content = request.Content ?? string.Empty,
            Color = request.Color
        };

        var created = await _noteRepository.CreateAsync(note, token);

        _logger.LogInformation("Заметка создана: {NoteId}", created.Id);

        return Ok(new NoteResponse
        {
            Id = created.Id,
            Content = created.Content,
            Color = created.Color
        });
    }
    
    /// <summary>
    /// Получение заметки по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NoteResponse>> GetByIdAsync([FromRoute] Guid id, CancellationToken token)
    {
        var note = await _noteRepository.GetByIdAsync(id, token);

        if (note is null)
        {
            return NotFound("Заметка не найдена");
        }

        return Ok(new NoteResponse
        {
            Id = note.Id,
            Content = note.Content,
            Color = note.Color
        });
    }
    
    /// <summary>
    /// Получение списка заметок
    /// </summary>
    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyCollection<NoteResponse>>> GetAllAsync(CancellationToken token)
    {
        var notes = await _noteRepository.GetAllAsync(token);

        var result = notes.Select(x => new NoteResponse
        {
            Id = x.Id,
            Content = x.Content,
            Color = x.Color
        }).ToList();

        return Ok(result);
    }
    
    /// <summary>
    /// Обновление текста заметки
    /// </summary>
    [HttpPatch("{id:guid}/content")]
    public async Task<ActionResult<NoteResponse>> UpdateContentAsync(
        [FromRoute] Guid id,
        [FromBody] NoteUpdateContentRequest request,
        CancellationToken token)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не задано");
        }

        var updated = await _noteRepository.UpdateContentAsync(id, request.Content ?? string.Empty, token);

        if (updated is null)
        {
            return NotFound("Заметка не найдена");
        }

        return Ok(new NoteResponse
        {
            Id = updated.Id,
            Content = updated.Content,
            Color = updated.Color
        });
    }

    /// <summary>
    /// Удаление заметки
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id, CancellationToken token)
    {
        var deleted = await _noteRepository.DeleteAsync(id, token);

        if (!deleted)
        {
            return NotFound("Заметка не найдена");
        }

        _logger.LogInformation("Заметка удалена: {NoteId}", id);

        return NoContent();
    }
}