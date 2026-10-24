using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.Data.Seed;

var configuration = new ConfigurationBuilder()
    .AddUserSecrets(typeof(AppDbContext).Assembly, optional: true)
    .AddEnvironmentVariables()
    .Build();

var connectionString = configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Configure a conexão local antes de executar a verificação.");

var options = new DbContextOptionsBuilder<AppDbContext>().UseNpgsql(connectionString).Options;
await using var context = new AppDbContext(options);
var data = CatalogSeedData.Load();

await VerifyCatalog();
CatalogSeeder.Seed(context);
await VerifyCatalog();
await CatalogSeeder.SeedAsync(context, CancellationToken.None);
await VerifyCatalog();

Console.WriteLine($"Validado: {data.Categories.Length} categorias, {data.Courses.Length} cursos, {data.Modules.Length} módulos e {data.Lessons.Length} aulas.");
Console.WriteLine("Todos os campos conferem com a carga inicial. Reexecuções síncrona e assíncrona não duplicaram nem alteraram os registros.");

async Task VerifyCatalog()
{
    VerifyRows(data.Categories, await context.Categories.AsNoTracking().ToListAsync());
    VerifyRows(data.Courses, await context.Courses.AsNoTracking().ToListAsync());
    VerifyRows(data.Modules, await context.Modules.AsNoTracking().ToListAsync());
    VerifyRows(data.Lessons, await context.Lessons.AsNoTracking().ToListAsync());

    if (await context.Courses.Select(course => course.CategoryId).Distinct().CountAsync() != 3
        || await context.Courses.Select(course => course.Modality).Distinct().CountAsync() != 2
        || await context.Courses.Select(course => course.Status).Distinct().CountAsync() != 3)
    {
        throw new InvalidOperationException("A variedade de categorias, modalidades e status não atende ao catálogo esperado.");
    }
}

void VerifyRows<TEntity>(IReadOnlyCollection<TEntity> expectedRows, IReadOnlyCollection<TEntity> actualRows) where TEntity : class
{
    if (expectedRows.Count != actualRows.Count)
        throw new InvalidOperationException($"Quantidade incorreta de registros para {typeof(TEntity).Name}.");

    var entityType = context.Model.FindEntityType(typeof(TEntity))!;
    var keys = entityType.FindPrimaryKey()!.Properties;

    foreach (var expected in expectedRows)
    {
        var actual = actualRows.SingleOrDefault(candidate => keys.All(key =>
            Equals(key.PropertyInfo!.GetValue(expected), key.PropertyInfo.GetValue(candidate))))
            ?? throw new InvalidOperationException($"Registro esperado não encontrado em {typeof(TEntity).Name}.");

        foreach (var property in entityType.GetProperties())
        {
            if (!Equals(property.PropertyInfo!.GetValue(expected), property.PropertyInfo.GetValue(actual)))
                throw new InvalidOperationException($"Valor diferente do esperado em {typeof(TEntity).Name}.{property.Name}.");
        }
    }
}
