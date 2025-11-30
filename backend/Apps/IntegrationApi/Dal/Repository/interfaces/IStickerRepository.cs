using Dal.Models.Stickers;
using InfraLib.MinIO.Storage;
using InfraLib.Redis.Models;
using Microsoft.AspNetCore.Http;

namespace Dal.Repository.interfaces;

/// <summary>
/// Репозиторий стикеров
/// </summary>
public interface IStickerRepository
{
    /// <summary>
    /// Загрузка стикеров и сохранение путей в базе
    /// </summary>
    Task<IReadOnlyCollection<Stickers>> UploadAsync(IReadOnlyList<IFormFile> files, MinioImageStorage storage, CancellationToken token);

    /// <summary>
    /// Получение списка стикеров
    /// </summary>
    Task<IReadOnlyCollection<Stickers>> GetAllAsync(CancellationToken token);
    
    /// <summary>
    /// удаление по айди
    /// </summary>
    Task<int> DeleteByIdAsync(Guid id, CancellationToken token);
    
    /// <summary>
    /// добавление на доску стикера
    /// </summary>
    Task<BoardSticker> AddToBoardAsync(Guid stickerId, CancellationToken token);
    
    /// <summary>
    /// получение инфы с доски
    /// </summary>
    Task<IReadOnlyCollection<BoardSticker>> GetBoardAsync(CancellationToken token);

}