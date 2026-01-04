namespace Api.Controllers.Models.Response.Markdown;

/// <summary>
/// Ответ markdown на доске
/// </summary>
public sealed class BoardMarkdownResponse
{
    /// <summary>
    /// Айди
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Айди маркдауна
    /// </summary>
    public Guid MarkdownId { get; set; }
    
    /// <summary>
    /// Ширина
    /// </summary>
    public int Width { get; set; }
    
    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
    
    /// <summary>
    /// Состояние открыто/закрыто для редактирования
    /// </summary>
    public bool IsEditorVisible { get; set; }
    
    /// <summary>
    /// Текст внутри маркдауна
    /// </summary>
    public string Content { get; set; } = string.Empty;
}
