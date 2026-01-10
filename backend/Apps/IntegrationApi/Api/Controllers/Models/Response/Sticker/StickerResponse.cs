namespace Api.Controllers.Models.Response.Sticker;

/// <summary>
/// Ответ с данными стикера
/// </summary>
public sealed class StickerResponse
{
    /// <summary>
    /// Идентификатор стикера
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Имя стикера
    /// </summary>
    public string Name { get; set; } = string.Empty;
}