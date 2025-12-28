using Dal.Models.Markdown;

namespace Dal.Repository.interfaces;

/// <summary>
/// Репозиторий markdown
/// </summary>
public interface IMarkdownRepository
{
    /// <summary>
    /// Создание markdown
    /// </summary>
    Task<Markdown> CreateAsync(Markdown markdown, CancellationToken token);

    /// <summary>
    /// Получение markdown по идентификатору
    /// </summary>
    Task<Markdown?> GetByIdAsync(Guid id, CancellationToken token);

    /// <summary>
    /// Получение списка markdown
    /// </summary>
    Task<IReadOnlyCollection<Markdown>> GetAllAsync(CancellationToken token);

    /// <summary>
    /// Обновление текста
    /// </summary>
    Task<Markdown?> UpdateContentAsync(Guid id, string content, CancellationToken token);

    /// <summary>
    /// Изменение размера
    /// </summary>
    Task<Markdown?> UpdateSizeAsync(Guid id, int width, int height, CancellationToken token);

    /// <summary>
    /// Удаление markdown
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken token);
    
    /// <summary>
    /// Добавление markdown на доску
    /// </summary>
    Task<BoardMarkdown> AddToBoardAsync(Guid markdownId, int width, int height, CancellationToken token);
    
    /// <summary>
    /// Получение доски
    /// </summary>
    Task<IReadOnlyCollection<BoardMarkdown>> GetBoardAsync(CancellationToken token);
    
    /// <summary>
    /// Изменение markdown маркдауна на доске
    /// </summary>
    Task<BoardMarkdown?> UpdateBoardSizeAsync(Guid id, int width, int height, CancellationToken token);
    
    /// <summary>
    /// Удаление markdown с доски
    /// </summary>
    Task<bool> DeleteBoardAsync(Guid id, CancellationToken token);

    /// <summary>
    /// Обновление состояния markdown
    /// </summary>
    Task<BoardMarkdown?> UpdateBoardEditorStateAsync(Guid id, bool isEditorVisible, CancellationToken token);
}