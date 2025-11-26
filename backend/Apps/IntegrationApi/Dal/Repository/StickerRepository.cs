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
INSERT INTO stickers (id, storage_path)
VALUES (@Id, @StoragePath);
";

        var result = new List<Stickers>(files.Count);

        foreach (var file in files)
        {
            var id = Guid.NewGuid();

            await using var stream = file.OpenReadStream();

            var contentType = string.IsNullOrWhiteSpace(file.ContentType)
                ? "application/octet-stream"
                : file.ContentType;

            var storagePath = await storage.UploadAsync(id, stream, contentType, token);

            var sticker = new Stickers
            {
                Id = id,
                StoragePath = storagePath
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
       storage_path AS StoragePath
FROM stickers;
";

        var result = await _connection.QueryAsync<Stickers>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }
}