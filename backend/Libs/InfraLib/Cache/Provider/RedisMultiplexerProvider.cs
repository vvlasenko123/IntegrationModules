using InfraLib.Cache.Options;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace InfraLib.Cache.Provider;

/// <summary>
/// Redis multiplexer provider
/// </summary>
public sealed class RedisMultiplexerProvider : IDisposable
{
    /// <summary>
    /// Механизм, который использует одно соединений для всех запросов, объединяя их в пайплайн (соединение)
    /// </summary>
    public IConnectionMultiplexer Multiplexer { get; }

    /// <summary>
    /// Конструктор
    /// </summary>
    public RedisMultiplexerProvider(IOptions<RedisOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);

        var value = options.Value;
        Multiplexer = ConnectionMultiplexer.Connect(value.Configuration);
    }

    ///<inheritdoc />
    public void Dispose()
    {
        Multiplexer.Dispose();
    }
}