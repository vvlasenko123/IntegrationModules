using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Migrations;

/// <summary>
/// Миграция заполнения данных таблиц стикеров
/// </summary>
public sealed class StickersSeedInitialMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<StickersSeedInitialMigration> _logger;

    public StickersSeedInitialMigration(
        IDbConnection connection,
        ILogger<StickersSeedInitialMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken token)
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции: очистка и заполнение таблицы stickers начальными стикерами");

        using var transaction = _connection.BeginTransaction();

        try
        {
            const string clearSql = @"
DELETE FROM board_stickers;
DELETE FROM stickers;
";

            await _connection.ExecuteAsync(new CommandDefinition(
                clearSql,
                transaction: transaction,
                cancellationToken: token));

            const string insertSql = @"
INSERT INTO stickers (id, name)
VALUES (@Id, @Name);
";

            var stickers = new (Guid Id, string Name)[]
            {
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c301"), "sticker1"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c302"), "sticker2"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c303"), "sticker3"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c304"), "sticker4"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c305"), "sticker5"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c306"), "sticker6"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c307"), "sticker7"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c308"), "sticker8"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c309"), "sticker9"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c30a"), "sticker10"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c30b"), "sticker11"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c30c"), "sticker12"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c30d"), "sticker13"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c30e"), "sticker14"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c30f"), "sticker15"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c310"), "sticker16"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c311"), "sticker17"),
                (Guid.Parse("2d5b8b2d-0c34-4b90-8f48-48b6b6d0c312"), "sticker18")
            };

            foreach (var sticker in stickers)
            {
                await _connection.ExecuteAsync(new CommandDefinition(
                    insertSql,
                    new
                    {
                        Id = sticker.Id,
                        Name = sticker.Name
                    },
                    transaction: transaction,
                    cancellationToken: token));
            }

            transaction.Commit();

            _logger.LogInformation("Таблица stickers очищена и заполнена. Количество: {Count}", stickers.Length);
        }
        catch (Exception ex)
        {
            transaction.Rollback();

            _logger.LogError(ex, "Ошибка миграции заполнения таблицы stickers");
            throw;
        }
    }
}
