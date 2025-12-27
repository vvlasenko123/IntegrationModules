namespace Dal.Models.Shapes;

/// <summary>
/// Фигура на доске
/// </summary>
public sealed class BoardShape
{
    /// <summary>
    /// Айди элемента
    /// </summary>
    public Guid Id { get; set; }
    
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
    /// Градусное вращение фигуры
    /// </summary>
    public double Rotation { get; set; }
}