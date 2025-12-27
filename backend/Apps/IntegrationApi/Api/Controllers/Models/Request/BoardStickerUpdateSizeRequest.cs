namespace Api.Controllers.Models.Request;

/// <summary>
/// Обновление размеров
/// </summary>
public sealed class BoardStickerUpdateSizeRequest
{
    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; set; }
}
