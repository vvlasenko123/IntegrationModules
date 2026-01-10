using Dal.Models.Stickers;
using InfraLib.MinIO.Storage;
using Microsoft.AspNetCore.Http;

namespace Dal.Repository.interfaces;

/// <summary>
/// Репозиторий стикеров
/// </summary>
public interface IStickerRepository
{
    /// <summary>
    /// Получение всех стикеров
    /// </summary>
    Task<IReadOnlyCollection<Sticker>> GetAllAsync(CancellationToken token);

    /// <summary>
    /// Получение стикера по id
    /// </summary>
    Task<Sticker?> GetByIdAsync(Guid id, CancellationToken token);

    /// <summary>
    /// Добавление стикера на доску
    /// </summary>
    Task<BoardSticker> AddToBoardAsync(Guid stickerId, int width, int height, CancellationToken token);

    /// <summary>
    /// Получение доски
    /// </summary>
    Task<IReadOnlyCollection<BoardSticker>> GetBoardAsync(CancellationToken token);

    /// <summary>
    /// Получение доски по айди
    /// </summary>
    Task<BoardSticker?> GetBoardByIdAsync(Guid id, CancellationToken token);

    /// <summary>
    /// Изменение стикера на доске
    /// </summary>
    Task<BoardSticker?> UpdateBoardTransformAsync(Guid id, int width, int height, CancellationToken token);

    /// <summary>
    /// Удаление стикера
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken token);
}