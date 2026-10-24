namespace Sesi.Catalogo.Api.Models;

public sealed class Category
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Icon { get; set; }
    public ICollection<Course> Courses { get; set; } = [];
}
