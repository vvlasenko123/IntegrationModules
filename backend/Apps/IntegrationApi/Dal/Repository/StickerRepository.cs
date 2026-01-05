using System.Data;
using Dal.Models.Stickers;
using Dal.Repository.interfaces;
using Dapper;
using InfraLib.MinIO.Storage;
using Microsoft.AspNetCore.Http;

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
    public async Task<IReadOnlyCollection<Stickers>> UploadAsync(IReadOnlyList<IFormFile> files, MinioImageStorage storage, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
INSERT INTO stickers (id, storage_path, width, height)
VALUES (@Id, @StoragePath, @Width, @Height);
";

        var result = new List<Stickers>(files.Count);

        foreach (var file in files)
        {
            var id = Guid.NewGuid();

            await using var stream = file.OpenReadStream();

            var contentType = string.IsNullOrWhiteSpace(file.ContentType)
                ? "application/octet-stream"
                : file.ContentType;

            var storagePath = await storage.UploadAsync(id, stream, contentType, "stickers",token);

            var sticker = new Stickers
            {
                Id = id,
                StoragePath = storagePath,
                Width = 160,
                Height = 180
            };

            await _connection.ExecuteAsync(new CommandDefinition(
                sql,
                sticker,
                cancellationToken: token));

            result.Add(sticker);
        }

        return result;
    }
    
    /// <inheritdoc />
    public async Task<IReadOnlyCollection<Stickers>> GetAllAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       storage_path AS StoragePath,
       width,
       height
FROM stickers;
";

        var result = await _connection.QueryAsync<Stickers>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }
  
    /// <inheritdoc />
    public async Task<int> DeleteByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
DELETE FROM board_stickers
WHERE id = @Id;
";

        return await _connection.ExecuteAsync(new CommandDefinition(
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
            Height = height
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
    public async Task<BoardSticker?> UpdateBoardSizeAsync(Guid id, int width, int height, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE board_stickers
SET width = @Width,
    height = @Height
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
}