namespace Sesi.Catalogo.Api.Models;

public sealed class Lesson
{
    public required string CourseId { get; set; }
    public required string ModuleId { get; set; }
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int Position { get; set; }
    public CourseModule Module { get; set; } = null!;
}
