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
}