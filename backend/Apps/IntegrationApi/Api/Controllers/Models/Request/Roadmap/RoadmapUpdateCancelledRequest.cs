namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос отмены
/// </summary>
public sealed class RoadmapUpdateCancelledRequest
{
    /// <summary>
    /// Состояние отменения
    /// </summary>
    public bool Cancelled { get; set; }
}