namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос на обновление даты
/// </summary>
public sealed class RoadmapUpdateDateRequest
{
    /// <summary>
    /// Дата
    /// </summary>
    public DateTimeOffset? Date { get; set; }
    
    /// <summary>
    /// Состояние завершенности
    /// </summary>
    public bool Completed { get; set; }
}