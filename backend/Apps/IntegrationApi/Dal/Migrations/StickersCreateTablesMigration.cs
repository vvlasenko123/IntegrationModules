using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция создания таблиц stickers, notes и board_stickers
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

CREATE TABLE IF NOT EXISTS board_stickers
(
    id uuid PRIMARY KEY,
    sticker_id uuid NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_board_stickers_sticker_id
ON board_stickers (sticker_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_board_stickers_sticker_id'
    ) THEN
        ALTER TABLE board_stickers
            ADD CONSTRAINT fk_board_stickers_sticker_id
            FOREIGN KEY (sticker_id)
            REFERENCES stickers(id)
            ON DELETE CASCADE;
    END IF;
END $$;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: создание таблиц stickers, notes и board_stickers");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}