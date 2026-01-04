namespace Api.Controllers.Models.Request.Markdown;

/// <summary>
/// Запрос для изменение состояния маркдауна
/// </summary>
public sealed class BoardMarkdownUpdateEditorStateRequest
{
    /// <summary>
    /// Состояние открыто/закрыто для редактирования
    /// </summary>
    public bool IsEditorVisible { get; set; }
}