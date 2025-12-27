namespace Api.Controllers.Models.Response;

/// <summary>
/// Ответ с данными заметки
/// </summary>
public sealed class NoteResponse
{
    /// <summary>
    /// Идентификатор заметки
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Текст заметки
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Цвет заметки
    /// </summary>
    public string Color { get; set; } = string.Empty;

    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}
