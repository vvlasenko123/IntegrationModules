namespace Dal.Models.Roadmap;

public class RoadmapItem
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTimeOffset? Date { get; set; }
    public bool Completed { get; set; }
    public bool Cancelled { get; set; }
    public int ZIndex { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public Guid? ParentId { get; set; }
}