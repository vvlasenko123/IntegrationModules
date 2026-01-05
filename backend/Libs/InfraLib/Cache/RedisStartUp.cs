using InfraLib.Cache.Configuration;
using InfraLib.Cache.Options;
using InfraLib.Cache.Provider;
using InfraLib.Validation.Options;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace InfraLib.Cache;

/// <summary>
/// Добавление настроек Redis
/// </summary>
public static class RedisStartUp
{
    /// <summary>
    /// Подключение Redis
    /// </summary>
    public static void AddRedis(this IServiceCollection services)
    {
        services.AddOptions<RedisOptions>()
            .BindConfiguration(configSectionPath: nameof(RedisOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        services.AddStackExchangeRedisCache(_ => { });
        services.AddSingleton<RedisMultiplexerProvider>();
        services.AddSingleton<IConfigureOptions<RedisCacheOptions>, RedisConfigurator>();
    }
}