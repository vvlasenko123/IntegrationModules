using System.Data;
using Dal.Models.Roadmap;
using Dal.Repository.interfaces.Roadmap;
using Dapper;

namespace Dal.Repository;

/// <inheritdoc />
public sealed class RoadmapRepository : IRoadmapRepository
{
    private readonly IDbConnection _connection;

    public RoadmapRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc />
    public async Task<RoadmapItem> CreateAsync(RoadmapItem item, CancellationToken token)
    {
        if (item is null)
        {
            throw new ArgumentNullException(nameof(item));
        }

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        item.Id = Guid.NewGuid();

        const string sql = @"
INSERT INTO roadmap_items (id, text, description, date, completed, cancelled, z_index, width, height, parent_id)
VALUES (@Id, @Text, @Description, @Date, @Completed, @Cancelled, @ZIndex, @Width, @Height, @ParentId);
";

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            item,
            cancellationToken: token));

        return item;
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> GetByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<IReadOnlyCollection<RoadmapItem>> GetAllAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items;
";

        var result = await _connection.QueryAsync<RoadmapItem>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> UpdateTextAsync(Guid id, string text, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE roadmap_items
SET text = @Text
WHERE id = @Id;

SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id, Text = text },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> UpdateDescriptionAsync(Guid id, string description, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE roadmap_items
SET description = @Description
WHERE id = @Id;

SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id, Description = description },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> UpdateDateAsync(Guid id, DateTimeOffset? date, bool completed, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE roadmap_items
SET date = @Date,
    completed = @Completed
WHERE id = @Id;

SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id, Date = date, Completed = completed },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> UpdateCompletedAsync(Guid id, bool completed, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE roadmap_items
SET completed = @Completed
WHERE id = @Id;

SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id, Completed = completed },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> UpdateCancelledAsync(Guid id, bool cancelled, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE roadmap_items
SET cancelled = @Cancelled
WHERE id = @Id;

SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id, Cancelled = cancelled },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> UpdateZIndexAsync(Guid id, int zIndex, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE roadmap_items
SET z_index = @ZIndex
WHERE id = @Id;

SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id, ZIndex = zIndex },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<RoadmapItem?> UpdateSizeAsync(Guid id, int width, int height, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE roadmap_items
SET width = @Width,
    height = @Height
WHERE id = @Id;

SELECT id,
       text,
       description,
       date,
       completed,
       cancelled,
       z_index AS ZIndex,
       width,
       height,
       parent_id AS ParentId
FROM roadmap_items
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<RoadmapItem>(new CommandDefinition(
            sql,
            new { Id = id, Width = width, Height = height },
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
DELETE FROM roadmap_items
WHERE id = @Id;
";

        var affected = await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));

        return affected > 0;
    }
}
