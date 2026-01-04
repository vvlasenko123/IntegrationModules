using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция добавление состояния маркдауна
/// </summary>
public sealed class MarkdownBoardAddEditorStateMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<MarkdownBoardAddEditorStateMigration> _logger;

    public MarkdownBoardAddEditorStateMigration(IDbConnection connection, ILogger<MarkdownBoardAddEditorStateMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
ALTER TABLE board_markdowns
ADD COLUMN IF NOT EXISTS is_editor_visible boolean NOT NULL DEFAULT true;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: добавление is_editor_visible в board_markdowns");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}
