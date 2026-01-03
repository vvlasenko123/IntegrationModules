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
    
    /// <summary>
    /// обновление текста
    /// </summary>
    Task<Note?> UpdateContentAsync(Guid id, string content, CancellationToken token);
    
    /// <summary>
    /// удаление заметок
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken token);
    
    /// <summary>
    /// изменение размера
    /// </summary>
    Task<Note?> UpdateSizeAsync(Guid id, int width, int height, CancellationToken token);
}