using System.Data;
using InfraLib.Database.PostgreSQL;
using InfraLib.Validation.Options;
using Microsoft.Extensions.DependencyInjection;

namespace InfraLib.Database;

/// <summary>
/// Добавелние настроек базы данных
/// </summary>
public static class DatabaseStartUp
{
    /// <summary>
    /// Добавление Postgres
    /// </summary>
    public static void AddPostgres(this IServiceCollection services)
    {
        services.AddOptions<PostgresOptions>()
            .BindConfiguration(configSectionPath: nameof(PostgresOptions))
            .UseValidationOptions()
            .ValidateOnStart();
        
        services.AddTransient<IDbConnection, PostgresConnection>();
        services.AddHostedService<PostgresMigrationHostedService>();
    }
}