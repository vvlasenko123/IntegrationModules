using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция создания таблиц stickers и notes
/// </summary>
public sealed class StickersCreateTablesMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<StickersCreateTablesMigration> _logger;

    public StickersCreateTablesMigration(IDbConnection connection, ILogger<StickersCreateTablesMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS stickers
(
    id uuid PRIMARY KEY,
    storage_path text NOT NULL
);

CREATE TABLE IF NOT EXISTS notes
(
    id uuid PRIMARY KEY,
    content text NOT NULL,
    color   text NOT NULL
);
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: создание таблиц stickers и notes");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}