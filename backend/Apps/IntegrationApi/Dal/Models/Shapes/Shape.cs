namespace Dal.Models.Shapes;

/// <summary>
/// Фигура
/// </summary>
public sealed class Shape
{
    /// <summary>
    /// Айди фигуры
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Фигура
    /// </summary>
    public string ShapeId { get; set; } = string.Empty;
}