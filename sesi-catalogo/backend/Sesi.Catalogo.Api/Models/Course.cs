namespace Sesi.Catalogo.Api.Models;

public sealed class Course
{
    public required string Id { get; set; }
    public required string FullName { get; set; }
    public required string ShortName { get; set; }
    public required string Description { get; set; }
    public required string CategoryId { get; set; }
    public required string Modality { get; set; }
    public int WorkloadHours { get; set; }
    public required string TargetAudience { get; set; }
    public required string Status { get; set; }
    public required string Image { get; set; }
    public DateOnly? AvailableFrom { get; set; }
    public Category Category { get; set; } = null!;
    public ICollection<CourseModule> Modules { get; set; } = [];
}
