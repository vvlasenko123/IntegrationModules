using InfraLib.Redis.Options;
using InfraLib.Validation.Options;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace InfraLib.Redis;

public static class RedisStartUp
{
    public static IServiceCollection AddRedis(this IServiceCollection services)
    {
        services.AddOptions<RedisOptions>()
            .BindConfiguration(configSectionPath: nameof(RedisOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        // TODO потом сменим на адрес хоста
        services.AddStackExchangeRedisCache(options => {
            options.Configuration = "localhost";
            options.InstanceName = "local";
        });

        services.AddOptions<RedisCacheOptions>()
            .Configure<IOptions<RedisOptions>>((cacheOptions, redisOptions) =>
            {
                cacheOptions.Configuration = redisOptions.Value.Configuration;

                if (!string.IsNullOrWhiteSpace(redisOptions.Value.InstanceName))
                {
                    cacheOptions.InstanceName = redisOptions.Value.InstanceName;
                }
            });

        return services;
    }
}