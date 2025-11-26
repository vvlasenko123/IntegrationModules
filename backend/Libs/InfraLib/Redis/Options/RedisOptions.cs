using Microsoft.Extensions.Options;

namespace InfraLib.Redis.Options;

public sealed class RedisOptions : IValidateOptions<RedisOptions>
{
    public string Configuration { get; init; } = string.Empty;
    public string InstanceName { get; init; } = string.Empty;

    public ValidateOptionsResult Validate(string? name, RedisOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.Configuration))
        {
            return ValidateOptionsResult.Fail("Configuration Redis не должен быть пустым");
        }

        return ValidateOptionsResult.Success;
    }
}