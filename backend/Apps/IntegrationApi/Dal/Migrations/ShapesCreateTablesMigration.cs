using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция создания таблиц фигур и фигур на доске
/// </summary>
public sealed class ShapesCreateTablesMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<ShapesCreateTablesMigration> _logger;

    public ShapesCreateTablesMigration(
        IDbConnection connection,
        ILogger<ShapesCreateTablesMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS shapes
(
    id uuid PRIMARY KEY,
    shape_id text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_shapes_shape_id
ON shapes (shape_id);

CREATE TABLE IF NOT EXISTS board_shapes
(
    id uuid PRIMARY KEY,
    shape_id uuid NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    rotation double precision NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_board_shapes_shape_id
ON board_shapes (shape_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_board_shapes_shape_id'
    ) THEN
        ALTER TABLE board_shapes
            ADD CONSTRAINT fk_board_shapes_shape_id
            FOREIGN KEY (shape_id)
            REFERENCES shapes(id)
            ON DELETE CASCADE;
    END IF;
END $$;

-- СИДИНГ ФИГУР (важно)
INSERT INTO shapes (id, shape_id)
VALUES
    (gen_random_uuid(), 'line'),
    (gen_random_uuid(), 'arrow'),
    (gen_random_uuid(), 'dblarrow'),
    (gen_random_uuid(), 'square'),
    (gen_random_uuid(), 'circle'),
    (gen_random_uuid(), 'triangle'),
    (gen_random_uuid(), 'star'),
    (gen_random_uuid(), 'parallelogram'),
    (gen_random_uuid(), 'roundedRect'),
    (gen_random_uuid(), 'capsule'),
    (gen_random_uuid(), 'pentagon'),
    (gen_random_uuid(), 'chevron'),
    (gen_random_uuid(), 'table3x3'),
    (gen_random_uuid(), 'table3x3LeftMerge'),
    (gen_random_uuid(), 'pyramid'),
    (gen_random_uuid(), 'circleArrow')
ON CONFLICT (shape_id) DO NOTHING;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: создание таблиц shapes и board_shapes");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}