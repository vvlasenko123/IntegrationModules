namespace Dal.Models.Stickers;

/// <summary>
/// стикер с доски
/// </summary>
public sealed class BoardSticker
{
    /// <summary>
    /// айди доски
    /// </summary>
    public Guid Id { get; init; }
    
    /// <summary>
    /// айди стикера
    /// </summary>
    public Guid StickerId { get; init; }
}