using Microsoft.EntityFrameworkCore;

namespace Sesi.Catalogo.Api.Data.Seed;

public static class CatalogSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Database.GetAppliedMigrations().Any()) return;

        var data = CatalogSeedData.Load();
        var categoryIds = context.Categories.AsNoTracking().Select(category => category.Id).ToHashSet();
        var courseIds = context.Courses.AsNoTracking().Select(course => course.Id).ToHashSet();
        var moduleIds = context.Modules.AsNoTracking().Select(module => new { module.CourseId, module.Id })
            .AsEnumerable().Select(module => (module.CourseId, module.Id)).ToHashSet();
        var lessonIds = context.Lessons.AsNoTracking().Select(lesson => new { lesson.CourseId, lesson.ModuleId, lesson.Id })
            .AsEnumerable().Select(lesson => (lesson.CourseId, lesson.ModuleId, lesson.Id)).ToHashSet();

        AddMissing(context, data, categoryIds, courseIds, moduleIds, lessonIds);
        context.SaveChanges();
    }

    public static async Task SeedAsync(AppDbContext context, CancellationToken cancellationToken)
    {
        if (!(await context.Database.GetAppliedMigrationsAsync(cancellationToken)).Any()) return;

        var data = CatalogSeedData.Load();
        var categoryIds = (await context.Categories.AsNoTracking().Select(category => category.Id).ToListAsync(cancellationToken)).ToHashSet();
        var courseIds = (await context.Courses.AsNoTracking().Select(course => course.Id).ToListAsync(cancellationToken)).ToHashSet();
        var modules = await context.Modules.AsNoTracking().Select(module => new { module.CourseId, module.Id }).ToListAsync(cancellationToken);
        var lessons = await context.Lessons.AsNoTracking().Select(lesson => new { lesson.CourseId, lesson.ModuleId, lesson.Id }).ToListAsync(cancellationToken);

        AddMissing(context, data, categoryIds, courseIds,
            modules.Select(module => (module.CourseId, module.Id)).ToHashSet(),
            lessons.Select(lesson => (lesson.CourseId, lesson.ModuleId, lesson.Id)).ToHashSet());
        await context.SaveChangesAsync(cancellationToken);
    }

    private static void AddMissing(
        AppDbContext context,
        CatalogSeedData data,
        HashSet<string> categoryIds,
        HashSet<string> courseIds,
        HashSet<(string CourseId, string Id)> moduleIds,
        HashSet<(string CourseId, string ModuleId, string Id)> lessonIds)
    {
        context.Categories.AddRange(data.Categories.Where(category => !categoryIds.Contains(category.Id)));
        context.Courses.AddRange(data.Courses.Where(course => !courseIds.Contains(course.Id)));
        context.Modules.AddRange(data.Modules.Where(module => !moduleIds.Contains((module.CourseId, module.Id))));
        context.Lessons.AddRange(data.Lessons.Where(lesson => !lessonIds.Contains((lesson.CourseId, lesson.ModuleId, lesson.Id))));
    }
}
