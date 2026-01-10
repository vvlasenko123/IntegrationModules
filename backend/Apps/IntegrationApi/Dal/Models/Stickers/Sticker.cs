namespace Dal.Models.Stickers;

/// <summary>
/// Модель стикера в базе
/// </summary>
public class Sticker
{
    /// <summary>
    /// Айди стикера
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Название стикера
    /// </summary>
    public string Name { get; set; } = string.Empty;
}