namespace Api.Controllers.Models.Response.Roadmap;

/// <summary>
/// Содержимое ответа roadmap
/// </summary>
public sealed class RoadmapItemResponse
{
    /// <summary>
    /// Айди элемента
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Текст
    /// </summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Описание
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Дата
    /// </summary>
    public DateTimeOffset? Date { get; set; }

    /// <summary>
    /// Состояние завершенности
    /// </summary>
    public bool Completed { get; set; }

    /// <summary>
    /// Состояние отмены
    /// </summary>
    public bool Cancelled { get; set; }

    /// <summary>
    /// z-index и есть z-index :)
    /// </summary>
    public int ZIndex { get; set; }

    /// <summary>
    /// Ширина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }

    /// <summary>
    /// Айди родителя
    /// </summary>
    public Guid? ParentId { get; set; }
}