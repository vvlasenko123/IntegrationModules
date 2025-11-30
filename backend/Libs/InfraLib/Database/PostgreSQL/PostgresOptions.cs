using Microsoft.Extensions.Options;
using Serilog;

namespace InfraLib.Database.PostgreSQL;

/// <summary>
/// Опции постгреса
/// </summary>
public sealed class PostgresOptions : IValidateOptions<PostgresOptions>
{
    /// <summary>
    /// Флаг автомиграций
    /// </summary>
    public bool AutoMigration { get; init; }

    /// <summary>
    /// Строка подключения из конфигурации
    /// </summary>
    public string? ConnectionString { get; init; }

    /// <inheritdoc />
    public ValidateOptionsResult Validate(string? name, PostgresOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.ConnectionString))
        {
            return ValidateOptionsResult.Fail("Строка подключения к Postgres не должна быть пустой");
        }

        if (options.AutoMigration is false)
        {
            Log.Warning("Миграции не будут применены");
        }
        else
        {
            Log.Warning("Включено применение миграций");
        }

        return ValidateOptionsResult.Success;
    }
}