namespace Dal.Models.Stickers;

/// <summary>
/// стикер с доски
/// </summary>
public sealed class BoardSticker
{
    /// <summary>
    /// Айди элемента
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Айди стикера
    /// </summary>
    public Guid StickerId { get; set; }

    /// <summary>
    /// Ширина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}