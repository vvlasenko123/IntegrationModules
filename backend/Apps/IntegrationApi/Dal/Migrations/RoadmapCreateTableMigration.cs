using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция добавления roadmap
/// </summary>
public sealed class RoadmapCreateTableMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<RoadmapCreateTableMigration> _logger;

    public RoadmapCreateTableMigration(IDbConnection connection, ILogger<RoadmapCreateTableMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS roadmap_items
(
    id uuid PRIMARY KEY,
    text text NOT NULL DEFAULT '',
    description text NOT NULL DEFAULT '',
    date timestamptz NULL,
    completed boolean NOT NULL DEFAULT false,
    cancelled boolean NOT NULL DEFAULT false,
    z_index integer NOT NULL DEFAULT 0,
    width integer NOT NULL DEFAULT 200,
    height integer NOT NULL DEFAULT 120,
    parent_id uuid NULL
);

CREATE INDEX IF NOT EXISTS ix_roadmap_items_parent_id
    ON roadmap_items(parent_id);
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: создание таблицы roadmap_items");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}
