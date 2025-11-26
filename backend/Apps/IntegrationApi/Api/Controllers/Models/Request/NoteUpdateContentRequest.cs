namespace Api.Controllers.Models.Request;

/// <summary>
/// Запрос на обновление текста заметки
/// </summary>
public sealed class NoteUpdateContentRequest
{
    /// <summary>
    /// Текст заметки
    /// </summary>
    public string Content { get; set; } = string.Empty;
}