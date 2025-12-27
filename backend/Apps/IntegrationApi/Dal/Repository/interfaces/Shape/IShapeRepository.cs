using Dal.Models.Shapes;

namespace Dal.Repository.interfaces;

/// <summary>
/// Репозиторий фигур
/// </summary>
public interface IShapeRepository
{
    /// <summary>
    /// Поулчение всех фигур
    /// </summary>
    Task<IReadOnlyCollection<Shape>> GetAllAsync(CancellationToken token);
    
    /// <summary>
    /// Получение фигуры по айди
    /// </summary>
    Task<Shape?> GetByIdAsync(Guid id, CancellationToken token);
    
    /// <summary>
    /// Добавление фигуры на доску
    /// </summary>
    Task<BoardShape> AddToBoardAsync(Guid shapeId, int width, int height, double rotation, CancellationToken token);
    
    /// <summary>
    /// Получение фигур с доски
    /// </summary>
    Task<IReadOnlyCollection<BoardShape>> GetBoardAsync(CancellationToken token);
    
    /// <summary>
    /// Получение одной фигуры с доски
    /// </summary>
    Task<BoardShape?> GetBoardByIdAsync(Guid id, CancellationToken token);
    
    /// <summary>
    /// Трансформация фигуры
    /// </summary>
    Task<BoardShape?> UpdateBoardTransformAsync(Guid id, int width, int height, double rotation, CancellationToken token);
}