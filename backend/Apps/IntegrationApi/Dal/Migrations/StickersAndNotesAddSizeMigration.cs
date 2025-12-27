using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция создания изменения таблиц стикеров и заметок
/// </summary>
public sealed class StickersAndNotesAddSizeMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<StickersAndNotesAddSizeMigration> _logger;

    public StickersAndNotesAddSizeMigration(
        IDbConnection connection,
        ILogger<StickersAndNotesAddSizeMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
ALTER TABLE stickers
    ADD COLUMN IF NOT EXISTS width  integer NOT NULL DEFAULT 91;

ALTER TABLE stickers
    ADD COLUMN IF NOT EXISTS height integer NOT NULL DEFAULT 84;

ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS width  integer NOT NULL DEFAULT 160;

ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS height integer NOT NULL DEFAULT 160;

ALTER TABLE board_stickers
    ADD COLUMN IF NOT EXISTS width  integer NOT NULL DEFAULT 91;

ALTER TABLE board_stickers
    ADD COLUMN IF NOT EXISTS height integer NOT NULL DEFAULT 84;

UPDATE notes
SET width = 160, height = 160
WHERE width = 0 OR height = 0;

UPDATE board_stickers
SET width = 91, height = 84
WHERE width = 160 OR height = 180 OR width = 0 OR height = 0;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: добавление width/height в таблицы stickers и notes");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}