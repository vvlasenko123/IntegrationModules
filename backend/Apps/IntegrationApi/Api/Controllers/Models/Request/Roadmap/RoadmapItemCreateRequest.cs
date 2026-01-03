namespace Api.Controllers.Models.Request.Roadmap;

/// <summary>
/// Запрос создания roadmap
/// </summary>
public sealed class RoadmapItemCreateRequest
{
    /// <summary>
    /// Содержимое (текст)
    /// </summary>
    public string? Text { get; set; }
    
    /// <summary>
    /// Описание
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// Дата
    /// </summary>
    public DateTimeOffset? Date { get; set; }
    
    /// <summary>
    /// Завершенный
    /// </summary>
    public bool? Completed { get; set; }
    
    /// <summary>
    /// Отмененное состояние
    /// </summary>
    public bool? Cancelled { get; set; }
    
    /// <summary>
    /// z-index и есть z-index :)
    /// </summary>
    public int? ZIndex { get; set; }
    
    /// <summary>
    /// Ширина
    /// </summary>
    public int? Width { get; set; }
    
    /// <summary>
    /// Высота
    /// </summary>
    public int? Height { get; set; }
    
    /// <summary>
    /// Айди родителя
    /// </summary>
    public Guid? ParentId { get; set; }
}