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
    /// Загрузка стикеров и сохранение путей в базе
    /// </summary>
    Task<IReadOnlyCollection<Stickers>> UploadAsync(IReadOnlyList<IFormFile> files, MinioImageStorage storage, CancellationToken token);

    /// <summary>
    /// Получение списка стикеров
    /// </summary>
    Task<IReadOnlyCollection<Stickers>> GetAllAsync(CancellationToken token);
}