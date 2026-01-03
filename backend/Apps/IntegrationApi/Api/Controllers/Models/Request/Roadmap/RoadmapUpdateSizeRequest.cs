namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос на обновление размеров
/// </summary>
public sealed class RoadmapUpdateSizeRequest
{
    /// <summary>
    /// Ширина
    /// </summary>
    public int Width { get; set; }
    
    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}