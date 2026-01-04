namespace Api.Controllers.Models.Request.Markdown;

/// <summary>
/// Запрос на обновление содержимого маркдауна
/// </summary>
public sealed class MarkdownRequest
{
    /// <summary>
    /// Текст markdown
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}
