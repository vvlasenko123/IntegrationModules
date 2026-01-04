namespace Api.Controllers.Models.Request.Markdown;

/// <summary>
/// Запрос на обновление контента маркдауна
/// </summary>
public sealed class MarkdownUpdateContentRequest
{
    /// <summary>
    /// Текст markdown
    /// </summary>
    public string Content { get; set; } = string.Empty;
}
