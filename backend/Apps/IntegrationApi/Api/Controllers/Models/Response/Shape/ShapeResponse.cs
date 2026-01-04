namespace Api.Controllers.Models.Response.Shape;

/// <summary>
/// Ответ фигуры
/// </summary>
public sealed class ShapeResponse
{
    /// <summary>
    /// Айди элемента
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Айди фигуры
    /// </summary>
    public string ShapeId { get; set; } = string.Empty;
}