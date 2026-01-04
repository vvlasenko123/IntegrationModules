namespace Dal.Models.Markdown;

/// <summary>
/// Маркдаун на доске
/// </summary>
public sealed class BoardMarkdown
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
    /// Состояние редактирования
    /// </summary>
    public bool IsEditorVisible { get; set; }
}