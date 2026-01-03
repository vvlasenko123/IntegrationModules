namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос на завершение
/// </summary>
public sealed class RoadmapUpdateCompletedRequest
{
    /// <summary>
    /// Состояние завершенности
    /// </summary>
    public bool Completed { get; set; }
}