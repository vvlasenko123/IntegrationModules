namespace Api.Controllers.Models.Response.Shape;

public sealed class BoardShapeResponse
{
    public Guid Id { get; set; }
    public Guid ShapeId { get; set; }

    public int Width { get; set; }
    public int Height { get; set; }
    public double Rotation { get; set; }
}