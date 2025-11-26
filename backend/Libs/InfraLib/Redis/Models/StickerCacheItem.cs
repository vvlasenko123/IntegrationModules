namespace InfraLib.Redis.Models;

public sealed class StickerCacheItem
{
    public Guid Id { get; set; }
    public string StoragePath { get; set; } = string.Empty;
}