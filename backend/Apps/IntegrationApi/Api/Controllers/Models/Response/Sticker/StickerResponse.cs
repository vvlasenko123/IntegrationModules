namespace Api.Controllers.Models.Response.Sticker;

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

    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}