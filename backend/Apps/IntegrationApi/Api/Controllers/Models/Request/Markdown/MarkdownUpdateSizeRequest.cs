namespace Api.Controllers.Models.Request.Markdown;

/// <summary>
/// Запрос на изменение размера маркдауна
/// </summary>
public sealed class MarkdownUpdateSizeRequest
{
    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}
