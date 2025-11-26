namespace Dal.Models.Notes;

/// <summary>
/// Модель заметки в базе
/// </summary>
public class Note
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
}