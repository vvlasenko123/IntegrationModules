using Microsoft.Extensions.Options;

namespace InfraLib.Cache.Options;

/// <summary>
/// Настройка опций Redis
/// </summary>
public sealed class RedisOptions : IValidateOptions<RedisOptions>
{
    /// <summary>
    /// Адрес (localhost:6379)
    /// </summary>
    public string Configuration { get; init; } = string.Empty;
    
    /// <summary>
    /// Название инстанса (источника)
    /// </summary>
    public string InstanceName { get; init; } = string.Empty;

    /// <inheritdoc />
    public ValidateOptionsResult Validate(string? name, RedisOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.Configuration) || string.IsNullOrWhiteSpace(options.InstanceName))
        {
            return ValidateOptionsResult.Fail("Не заполнены обязательные поля подключения к Redis (Configuration, InstanceName)");
        }

        return ValidateOptionsResult.Success;
    }
}