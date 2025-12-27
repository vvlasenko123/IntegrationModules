using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция отката - удаление таблиц shapes и board_shapes
/// </summary>
public sealed class ShapesDropTablesRollbackMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<ShapesDropTablesRollbackMigration> _logger;

    public ShapesDropTablesRollbackMigration(
        IDbConnection connection,
        ILogger<ShapesDropTablesRollbackMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
DROP TABLE IF EXISTS board_shapes;
DROP TABLE IF EXISTS shapes;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: удаление таблиц shapes и board_shapes");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}