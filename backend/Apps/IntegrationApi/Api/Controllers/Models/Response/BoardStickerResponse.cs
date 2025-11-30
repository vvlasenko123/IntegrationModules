namespace Api.Controllers.Models.Response;

/// <summary>
/// dto board sticker
/// </summary>
public sealed class BoardStickerResponse
{
    /// <summary>
    /// айди доски
    /// </summary>
    public Guid Id { get; init; }
    
    /// <summary>
    /// айди стикеры
    /// </summary>
    public Guid StickerId { get; init; }
    
    /// <summary>
    /// url
    /// </summary>
    public string Url { get; init; } = string.Empty;
}