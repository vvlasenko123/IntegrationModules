using System.Data;
using Dal.Models.Stickers;
using Dal.Repository.interfaces;
using Dapper;

namespace Dal.Repository;

/// <inheritdoc />
public sealed class StickerRepository : IStickerRepository
{
    private readonly IDbConnection _connection;

    public StickerRepository(IDbConnection connection)
    {
        _connection = connection;
    }
    
    /// <inheritdoc />
    public async Task<IReadOnlyCollection<Sticker>> GetAllAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       name
FROM stickers
ORDER BY name;
";

        var result = await _connection.QueryAsync<Sticker>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<Sticker?> GetByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       name
FROM stickers
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<Sticker>(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<BoardSticker> AddToBoardAsync(Guid stickerId, int width, int height, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
INSERT INTO board_stickers (id, sticker_id, width, height)
VALUES (@Id, @StickerId, @Width, @Height);
";

        var entity = new BoardSticker
        {
            Id = Guid.NewGuid(),
            StickerId = stickerId,
            Width = width,
            Height = height,
        };

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            entity,
            cancellationToken: token));

        return entity;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyCollection<BoardSticker>> GetBoardAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       sticker_id AS StickerId,
       width,
       height
FROM board_stickers
ORDER BY id;
";

        var result = await _connection.QueryAsync<BoardSticker>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<BoardSticker?> GetBoardByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       sticker_id AS StickerId,
       width,
       height
FROM board_stickers
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<BoardSticker>(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<BoardSticker?> UpdateBoardTransformAsync(Guid id, int width, int height, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE board_stickers
SET width = @Width,
    height = @Height,
WHERE id = @Id;

SELECT id,
       sticker_id AS StickerId,
       width,
       height
FROM board_stickers
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<BoardSticker>(new CommandDefinition(
            sql,
            new
            {
                Id = id,
                Width = width,
                Height = height
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
DELETE FROM board_stickers
WHERE id = @Id;
";

        var affected = await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));

        return affected > 0;
    }
}