namespace Dal.Models.Stickers;

/// <summary>
/// Модель стикера в базе
/// </summary>
public class Stickers
{
    /// <summary>
    /// Идентификатор стикера
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Путь до объекта в Minio
    /// </summary>
    public string StoragePath { get; set; } = string.Empty;
}