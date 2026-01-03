namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос на обновление z-index
/// </summary>
public sealed class RoadmapUpdateZIndexRequest
{
    /// <summary>
    /// z-index и есть z-index :)
    /// </summary>
    public int ZIndex { get; set; }
}