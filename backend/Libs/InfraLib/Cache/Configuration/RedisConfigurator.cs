using InfraLib.Cache.Options;
using InfraLib.Cache.Provider;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace InfraLib.Cache.Configuration;

/// <summary>
/// Настраивает трафик Redis
/// </summary>
public sealed class RedisConfigurator : IConfigureOptions<RedisCacheOptions>
{
    /// <summary>
    /// Механизм, который использует одно соединений для всех запросов, объединяя их в пайплайн (соединение)
    /// </summary>
    private readonly IConnectionMultiplexer _multiplexer;
    
    /// <summary>
    /// Опции Redis
    /// </summary>
    private readonly RedisOptions? _redisOptions;
    
    /// <summary>
    /// Конструктор
    /// </summary>
    public RedisConfigurator(IOptions<RedisOptions> redisOptions, RedisMultiplexerProvider provider)
    {
        _redisOptions = redisOptions.Value;
        _multiplexer = provider.Multiplexer;
    }

    /// <summary>
    /// Настраивает куда будет идти трафик Redis
    /// </summary>
    public void Configure(RedisCacheOptions options)
    {
        options.Configuration = _redisOptions?.Configuration;
        options.InstanceName = _redisOptions?.InstanceName;
        options.ConnectionMultiplexerFactory = () => Task.FromResult(_multiplexer);
    }
}