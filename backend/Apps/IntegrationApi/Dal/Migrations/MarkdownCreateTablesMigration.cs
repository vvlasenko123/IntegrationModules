using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция создания таблицы markdown
/// </summary>
public sealed class MarkdownCreateTablesMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<MarkdownCreateTablesMigration> _logger;

    public MarkdownCreateTablesMigration(IDbConnection connection, ILogger<MarkdownCreateTablesMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS markdowns
(
    id uuid PRIMARY KEY,
    content text NOT NULL,
    width int NOT NULL,
    height int NOT NULL
);

CREATE TABLE IF NOT EXISTS board_markdowns
(
    id uuid PRIMARY KEY,
    markdown_id uuid NOT NULL,
    width int NOT NULL,
    height int NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_board_markdowns_markdown_id
ON board_markdowns (markdown_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_board_markdowns_markdown_id'
    ) THEN
        ALTER TABLE board_markdowns
            ADD CONSTRAINT fk_board_markdowns_markdown_id
            FOREIGN KEY (markdown_id)
            REFERENCES markdowns(id)
            ON DELETE CASCADE;
    END IF;
END $$;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: создание таблиц markdowns и board_markdowns");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}
