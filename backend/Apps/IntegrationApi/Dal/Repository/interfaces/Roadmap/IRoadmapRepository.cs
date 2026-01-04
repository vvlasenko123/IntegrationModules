using Dal.Models.Roadmap;

namespace Dal.Repository.interfaces.Roadmap;

/// <summary>
/// Репозиторий roadmap
/// </summary>
public interface IRoadmapRepository
{
    /// <summary>
    /// Создание roadmap
    /// </summary>
    Task<RoadmapItem> CreateAsync(RoadmapItem item, CancellationToken token);

    /// <summary>
    /// Получение roadmap по id
    /// </summary>
    Task<RoadmapItem?> GetByIdAsync(Guid id, CancellationToken token);

    /// <summary>
    /// Получение всех roadmap
    /// </summary>
    Task<IReadOnlyCollection<RoadmapItem>> GetAllAsync(CancellationToken token);

    /// <summary>
    /// Обновление содержимого (текста)
    /// </summary>
    Task<RoadmapItem?> UpdateTextAsync(Guid id, string text, CancellationToken token);

    /// <summary>
    /// Обновление описания
    /// </summary>
    Task<RoadmapItem?> UpdateDescriptionAsync(Guid id, string description, CancellationToken token);

    /// <summary>
    /// Обновление даты
    /// </summary>
    Task<RoadmapItem?> UpdateDateAsync(Guid id, DateTimeOffset? date, bool completed, CancellationToken token);

    /// <summary>
    /// Обновление состояния завершенности
    /// </summary>
    Task<RoadmapItem?> UpdateCompletedAsync(Guid id, bool completed, CancellationToken token);

    /// <summary>
    /// Обновление состояния отмены
    /// </summary>
    Task<RoadmapItem?> UpdateCancelledAsync(Guid id, bool cancelled, CancellationToken token);

    /// <summary>
    /// Обновление z-index
    /// </summary>
    Task<RoadmapItem?> UpdateZIndexAsync(Guid id, int zIndex, CancellationToken token);

    /// <summary>
    /// Обновление размера
    /// </summary>
    Task<RoadmapItem?> UpdateSizeAsync(Guid id, int width, int height, CancellationToken token);

    /// <summary>
    /// Удаление roadmap
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken token);
}