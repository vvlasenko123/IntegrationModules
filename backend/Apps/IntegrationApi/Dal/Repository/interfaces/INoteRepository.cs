using Dal.Models.Notes;

namespace Dal.Repository.interfaces;

/// <summary>
/// Репозиторий заметок
/// </summary>
public interface INoteRepository
{
    /// <summary>
    /// Создание заметки
    /// </summary>
    Task<Note> CreateAsync(Note note, CancellationToken token);

    /// <summary>
    /// Получение заметки по идентификатору
    /// </summary>
    Task<Note?> GetByIdAsync(Guid id, CancellationToken token);

    /// <summary>
    /// Получение списка заметок
    /// </summary>
    Task<IReadOnlyCollection<Note>> GetAllAsync(CancellationToken token);
}