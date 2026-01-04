using System.Data;
using Dal.Models.Markdown;
using Dal.Repository.interfaces;
using Dapper;

namespace Dal.Repository;

/// <inheritdoc />
public sealed class MarkdownRepository : IMarkdownRepository
{
    private readonly IDbConnection _connection;

    public MarkdownRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc />
    public async Task<Markdown> CreateAsync(Markdown markdown, CancellationToken token)
    {
        if (markdown is null)
        {
            throw new ArgumentNullException(nameof(markdown));
        }

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        markdown.Id = Guid.NewGuid();

        const string sql = @"
INSERT INTO markdowns (id, content, width, height)
VALUES (@Id, @Content, @Width, @Height);
";

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            markdown,
            cancellationToken: token));

        return markdown;
    }

    public async Task<Markdown?> GetByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       content,
       width,
       height
FROM markdowns
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<Markdown>(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<IReadOnlyCollection<Markdown>> GetAllAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       content,
       width,
       height
FROM markdowns;
";

        var result = await _connection.QueryAsync<Markdown>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<Markdown?> UpdateContentAsync(Guid id, string content, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE markdowns
SET content = @Content
WHERE id = @Id;

SELECT id,
       content,
       width,
       height
FROM markdowns
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<Markdown>(new CommandDefinition(
            sql,
            new
            {
                Id = id,
                Content = content
            },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<Markdown?> UpdateSizeAsync(Guid id, int width, int height, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE markdowns
SET width = @Width,
    height = @Height
WHERE id = @Id;

SELECT id,
       content,
       width,
       height
FROM markdowns
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<Markdown>(new CommandDefinition(
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
DELETE FROM markdowns
WHERE id = @Id;
";

        var affected = await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));

        return affected > 0;
    }

    /// <inheritdoc />
    public async Task<BoardMarkdown> AddToBoardAsync(Guid markdownId, int width, int height, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
INSERT INTO board_markdowns (id, markdown_id, width, height, is_editor_visible)
VALUES (@Id, @MarkdownId, @Width, @Height, @IsEditorVisible);
";

        var entity = new BoardMarkdown
        {
            Id = Guid.NewGuid(),
            MarkdownId = markdownId,
            Width = width,
            Height = height,
            IsEditorVisible = true
        };

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            entity,
            cancellationToken: token));

        return entity;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyCollection<BoardMarkdown>> GetBoardAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       markdown_id AS MarkdownId,
       width,
       height,
       is_editor_visible AS IsEditorVisible
FROM board_markdowns
ORDER BY id;
";

        var result = await _connection.QueryAsync<BoardMarkdown>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<BoardMarkdown?> UpdateBoardSizeAsync(Guid id, int width, int height, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE board_markdowns
SET width = @Width,
    height = @Height
WHERE id = @Id;

SELECT id,
       markdown_id AS MarkdownId,
       width,
       height,
       is_editor_visible AS IsEditorVisible
FROM board_markdowns
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<BoardMarkdown>(new CommandDefinition(
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
    public async Task<bool> DeleteBoardAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
    DELETE FROM board_markdowns
    WHERE id = @Id;
    ";

        var affected = await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));

        return affected > 0;
    }

    /// <inheritdoc />
    public async Task<BoardMarkdown?> UpdateBoardEditorStateAsync(Guid id, bool isEditorVisible, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE board_markdowns
SET is_editor_visible = @IsEditorVisible
WHERE id = @Id;

SELECT id,
       markdown_id AS MarkdownId,
       width,
       height,
       is_editor_visible AS IsEditorVisible
FROM board_markdowns
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<BoardMarkdown>(new CommandDefinition(
            sql,
            new
            {
                Id = id,
                IsEditorVisible = isEditorVisible
            },
            cancellationToken: token));
    }
}