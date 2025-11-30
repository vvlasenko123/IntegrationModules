using System.Text.Json;
using InfraLib.Redis.Models;
using Microsoft.Extensions.Caching.Distributed;

namespace InfraLib.Minio;

/// <summary>
/// minio helper
/// </summary>
public static class MinIOHelper
{
    public const string StickersCacheKey = "stickers:get-all:v1";

    /// <summary>
    /// получение стикеров из кэша
    /// </summary>
    public static async Task<List<StickerCacheItem>> GetOrSetCachedItemsAsync(
        IDistributedCache cache,
        Func<CancellationToken, Task<List<StickerCacheItem>>> factory,
        CancellationToken token)
    {
        var cached = await cache.GetAsync(StickersCacheKey, token);

        if (cached is not null)
        {
            return JsonSerializer.Deserialize<List<StickerCacheItem>>(cached) ?? new List<StickerCacheItem>(0);
        }

        var items = await factory(token);

        await cache.SetAsync(
            StickersCacheKey,
            JsonSerializer.SerializeToUtf8Bytes(items),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
            },
            token);

        return items;
    }
}