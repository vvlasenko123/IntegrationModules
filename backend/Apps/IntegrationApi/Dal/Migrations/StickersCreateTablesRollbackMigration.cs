using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Откат миграции - создание таблиц stickers, notes и board_stickers
/// </summary>
public sealed class StickersCreateTablesRollbackMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<StickersCreateTablesRollbackMigration> _logger;

    public StickersCreateTablesRollbackMigration(
        IDbConnection connection,
        ILogger<StickersCreateTablesRollbackMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
DROP TABLE IF EXISTS board_stickers;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS stickers;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Откат миграции: удаление таблиц stickers, notes и board_stickers");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}