using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Откат миграции - добавление width/height в таблицы stickers, notes и board_stickers
/// </summary>
public sealed class StickersAndNotesAddSizeRollbackMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<StickersAndNotesAddSizeRollbackMigration> _logger;

    public StickersAndNotesAddSizeRollbackMigration(
        IDbConnection connection,
        ILogger<StickersAndNotesAddSizeRollbackMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
ALTER TABLE board_stickers
    DROP COLUMN IF EXISTS width,
    DROP COLUMN IF EXISTS height;

ALTER TABLE notes
    DROP COLUMN IF EXISTS width,
    DROP COLUMN IF EXISTS height;

ALTER TABLE stickers
    DROP COLUMN IF EXISTS width,
    DROP COLUMN IF EXISTS height;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Откат миграции: удаление width/height из таблиц stickers, notes и board_stickers");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}