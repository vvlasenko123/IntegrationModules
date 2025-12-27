namespace Api.Controllers.Models.Request.Shape;

/// <summary>
/// Трансформация фигуры на доске
/// </summary>
public sealed class BoardShapeUpdateTransformRequest
{
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