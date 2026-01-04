namespace Api.Controllers.Models.Response.Sticker;

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

    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; init; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; init; }
}