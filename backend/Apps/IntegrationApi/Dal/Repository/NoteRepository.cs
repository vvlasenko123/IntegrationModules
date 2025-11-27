using System.Data;
using Dal.Models.Notes;
using Dal.Repository.interfaces;
using Dapper;

namespace Dal.Repository;

/// <inheritdoc />
public sealed class NoteRepository : INoteRepository
{
    private readonly IDbConnection _connection;

    public NoteRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc />
    public async Task<Note> CreateAsync(Note note, CancellationToken token)
    {
        if (note is null)
        {
            throw new ArgumentNullException(nameof(note));
        }

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        note.Id = Guid.NewGuid();

        const string sql = @"
INSERT INTO notes (id, content, color)
VALUES (@Id, @Content, @Color);
";

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            note,
            cancellationToken: token));

        return note;
    }

    /// <inheritdoc />
    public async Task<Note?> GetByIdAsync(Guid id, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       content,
       color
FROM notes
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<Note>(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));
    }

    /// <inheritdoc />
    public async Task<IReadOnlyCollection<Note>> GetAllAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
SELECT id,
       content,
       color
FROM notes;
";

        var result = await _connection.QueryAsync<Note>(new CommandDefinition(
            sql,
            cancellationToken: token));

        return result.AsList();
    }

    /// <inheritdoc />
    public async Task<Note?> UpdateContentAsync(Guid id, string content, CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        const string sql = @"
UPDATE notes
SET content = @Content
WHERE id = @Id;

SELECT id,
       content,
       color
FROM notes
WHERE id = @Id;
";

        return await _connection.QuerySingleOrDefaultAsync<Note>(new CommandDefinition(
            sql,
            new
            {
                Id = id,
                Content = content
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
DELETE FROM notes
WHERE id = @Id;
";

        var affected = await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            new { Id = id },
            cancellationToken: token));

        return affected > 0;
    }
}
