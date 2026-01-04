namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос на обновление содержимого (текст)
/// </summary>
public sealed class RoadmapUpdateTextRequest
{
    /// <summary>
    /// Текст
    /// </summary>
    public string? Text { get; set; }
}