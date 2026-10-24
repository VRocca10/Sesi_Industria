using System.Text.Json;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Data.Seed;

public sealed class CatalogSeedData
{
    public required Category[] Categories { get; init; }
    public required Course[] Courses { get; init; }
    public required CourseModule[] Modules { get; init; }
    public required Lesson[] Lessons { get; init; }

    public static CatalogSeedData Load()
    {
        using var stream = typeof(CatalogSeedData).Assembly.GetManifestResourceStream("CatalogSeed.json")
            ?? throw new InvalidOperationException("O arquivo de dados iniciais não foi encontrado.");

        return JsonSerializer.Deserialize<CatalogSeedData>(stream, new JsonSerializerOptions(JsonSerializerDefaults.Web))
            ?? throw new InvalidOperationException("O arquivo de dados iniciais está vazio.");
    }
}
