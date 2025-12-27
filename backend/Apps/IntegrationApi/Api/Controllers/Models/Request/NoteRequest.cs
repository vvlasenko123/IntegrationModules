namespace Api.Controllers.Models.Request;

/// <summary>
/// Запрос на создание заметки
/// </summary>
public sealed class NoteRequest
{
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

