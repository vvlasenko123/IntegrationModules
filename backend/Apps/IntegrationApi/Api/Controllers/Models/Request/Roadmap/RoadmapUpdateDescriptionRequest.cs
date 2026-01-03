namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос на обновление описания
/// </summary>
public sealed class RoadmapUpdateDescriptionRequest
{
    /// <summary>
    /// Описание
    /// </summary>
    public string? Description { get; set; }
}