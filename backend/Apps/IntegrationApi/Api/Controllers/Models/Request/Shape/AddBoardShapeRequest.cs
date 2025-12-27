namespace Api.Controllers.Models.Request.Shape;

/// <summary>
/// Добавление фигуры на доску
/// </summary>
public sealed class AddBoardShapeRequest
{
    /// <summary>
    /// Айди фигуры
    /// </summary>
    public Guid ShapeId { get; set; }

    /// <summary>
    /// Ширина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
    
    /// <summary>
    /// Вращение фигуры
    /// </summary>
    public double Rotation { get; set; }
}