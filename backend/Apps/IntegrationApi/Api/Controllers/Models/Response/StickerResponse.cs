namespace Api.Controllers.Models.Response;

/// <summary>
/// Ответ с данными стикера
/// </summary>
public sealed class StickerResponse
{
    /// <summary>
    /// Идентификатор стикера
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Путь до объекта в Minio
    /// </summary>
    public string StoragePath { get; set; } = string.Empty;

    /// <summary>
    /// Ссылка на скачивание стикера
    /// </summary>
    public string Url { get; set; } = string.Empty;
}