namespace Sesi.Catalogo.Api.Models;

public sealed class CourseModule
{
    public required string CourseId { get; set; }
    public required string Id { get; set; }
    public required string Name { get; set; }
    public int Position { get; set; }
    public Course Course { get; set; } = null!;
    public ICollection<Lesson> Lessons { get; set; } = [];
}
