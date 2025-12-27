using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция сидов фигуры
/// </summary>
public sealed class ShapesSeedMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<ShapesSeedMigration> _logger;

    public ShapesSeedMigration(IDbConnection connection, ILogger<ShapesSeedMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        const string sql = @"
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'line') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'arrow') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'dblarrow') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'square') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'circle') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'triangle') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'star') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'parallelogram') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'stick') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'roundedRect') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'capsule') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'pentagon') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'chevron') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'table3x3') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'table3x3LeftMerge') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'pyramid') ON CONFLICT (shape_id) DO NOTHING;
INSERT INTO shapes (id, shape_id) VALUES (gen_random_uuid(), 'circleArrow') ON CONFLICT (shape_id) DO NOTHING;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: заполнение таблицы shapes начальными фигурами");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: token));
    }
}
