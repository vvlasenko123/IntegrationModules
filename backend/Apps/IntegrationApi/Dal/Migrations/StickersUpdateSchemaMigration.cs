using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;


/// <summary>
/// Миграция обновления стикеров
/// </summary>
public sealed class StickersUpdateSchemaMigration : IDatabaseMigration
{
    private const int DefaultStickerWidth = 80;
    private const int DefaultStickerHeight = 80;

    private readonly IDbConnection _connection;
    private readonly ILogger<StickersUpdateSchemaMigration> _logger;

    public StickersUpdateSchemaMigration(
        IDbConnection connection,
        ILogger<StickersUpdateSchemaMigration> logger)
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
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS board_stickers
(
    id uuid PRIMARY KEY,
    sticker_id uuid NOT NULL,
    width int NOT NULL,
    height int NOT NULL
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

ALTER TABLE IF EXISTS stickers
    ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';

ALTER TABLE IF EXISTS stickers
    DROP COLUMN IF EXISTS storage_path;

ALTER TABLE IF EXISTS stickers
    DROP COLUMN IF EXISTS width;

ALTER TABLE IF EXISTS stickers
    DROP COLUMN IF EXISTS height;

ALTER TABLE IF EXISTS board_stickers
    ADD COLUMN IF NOT EXISTS width int NOT NULL DEFAULT 80;

ALTER TABLE IF EXISTS board_stickers
    ADD COLUMN IF NOT EXISTS height int NOT NULL DEFAULT 80;

ALTER TABLE IF EXISTS board_stickers
    ALTER COLUMN width DROP DEFAULT;

ALTER TABLE IF EXISTS board_stickers
    ALTER COLUMN height DROP DEFAULT;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: обновление схемы stickers и board_stickers");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}