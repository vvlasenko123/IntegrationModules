using System.Data;
using InfraLib.Database.PostgreSQL;
using InfraLib.Validation.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Npgsql;

namespace InfraLib.Database;

/// <summary>
/// Добавелние настроек базы данных
/// </summary>
public static class DatabaseStartUp
{
    /// <summary>
    /// Добавление Postgres
    /// </summary>
    public static IServiceCollection AddPostgres(this IServiceCollection services)
    {
        services.AddOptions<PostgresOptions>()
            .BindConfiguration(configSectionPath: nameof(PostgresOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        services.AddTransient<IDbConnection>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<PostgresOptions>>();
            var builder = new NpgsqlConnectionStringBuilder(options.Value.ConnectionString);
            return new NpgsqlConnection(builder.ConnectionString);
        });
        
        services.AddTransient<IDbConnection, PostgresConnection>();
        services.AddHostedService<PostgresMigrationHostedService>();
        return services;
    }
}