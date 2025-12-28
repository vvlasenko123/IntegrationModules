namespace Api.Controllers.Models.Request.Markdown;

/// <summary>
/// Запрос маркдауна на доску
/// </summary>
public sealed class AddBoardMarkdownRequest
{
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
}