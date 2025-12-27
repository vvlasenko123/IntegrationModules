namespace Api.Controllers.Models.Request;

/// <summary>
/// добавление стикера на доску dto
/// </summary>
public sealed class AddBoardStickerRequest
{
    /// <summary>
    /// айди стикера
    /// </summary>
    public Guid StickerId { get; init; }

    /// <summary>
    /// Длина
    /// </summary>
    public int Width { get; init; }

    /// <summary>
    /// Высота
    /// </summary>
    public int Height { get; init; }
}