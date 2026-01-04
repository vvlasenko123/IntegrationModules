using System.Data;
using Dapper;
using Dal.Models.Shapes;
using Dal.Repository.interfaces;

namespace Dal.Repository;

/// <inheritdoc />
public sealed class ShapeRepository : IShapeRepository
{
    private readonly IDbConnection _connection;

    public ShapeRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyCollection<Shape>> GetAllAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       shape_id AS ShapeId
FROM shapes
ORDER BY shape_id;
";

        var result = await _connection.QueryAsync<Shape>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<Shape?> GetByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       shape_id AS ShapeId
FROM shapes
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<Shape>(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<BoardShape> AddToBoardAsync(Guid shapeId, int width, int height, double rotation, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
INSERT INTO board_shapes (id, shape_id, width, height, rotation)
VALUES (@Id, @ShapeId, @Width, @Height, @Rotation);
";

        var entity = new BoardShape
        {
            Id = Guid.NewGuid(),
            ShapeId = shapeId,
            Width = width,
            Height = height,
            Rotation = rotation
        };

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            entity,
            cancellationToken: token));

        return entity;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyCollection<BoardShape>> GetBoardAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       shape_id AS ShapeId,
       width,
       height,
       rotation
FROM board_shapes
ORDER BY id;
";

        var result = await _connection.QueryAsync<BoardShape>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<BoardShape?> GetBoardByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       shape_id AS ShapeId,
       width,
       height,
       rotation
FROM board_shapes
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<BoardShape>(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<BoardShape?> UpdateBoardTransformAsync(Guid id, int width, int height, double rotation, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE board_shapes
SET width = @Width,
    height = @Height,
    rotation = @Rotation
WHERE id = @Id;

SELECT id,
       shape_id AS ShapeId,
       width,
       height,
       rotation
FROM board_shapes
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<BoardShape>(new CommandDefinition(
            sql,
            new
            {
                Id = id,
                Width = width,
                Height = height,
                Rotation = rotation
            },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
        
        const string sql = @"
SELECT id,
       shape_id AS ShapeId
DELETE FROM shapes
WHERE id = @Id;
";

        var affected = await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));

        return affected > 0;
    }
}
