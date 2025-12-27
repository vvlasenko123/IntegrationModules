namespace InfraLib.Redis.Models;

/// <summary>
/// Кэш для стикера
/// </summary>
public sealed class StickerCacheItem
{
    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Путь в minIO
    /// </summary>
    public string StoragePath { get; set; } = string.Empty;

    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}