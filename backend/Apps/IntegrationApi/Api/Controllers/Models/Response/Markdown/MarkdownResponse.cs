namespace Api.Controllers.Models.Response.Markdown;

/// <summary>
/// Ответ с данными маркдауна
/// </summary>
public sealed class MarkdownResponse
{
    /// <summary>
    /// Идентификатор markdown
    /// </summary>
    public Guid Id { get; set; }

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
