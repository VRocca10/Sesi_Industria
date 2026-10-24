using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.DTOs;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Services;

public sealed class CourseCatalogService(AppDbContext context)
{
    private static readonly Expression<Func<Course, CourseDto>> Projection = course => new CourseDto(
        course.Id,
        course.FullName,
        course.ShortName,
        course.Description,
        new CategoryDto(course.Category.Id, course.Category.Name, course.Category.Icon),
        course.Modality,
        course.WorkloadHours,
        course.TargetAudience,
        course.Status,
        course.Image,
        course.AvailableFrom,
        course.Modules.OrderBy(module => module.Position).ThenBy(module => module.Id)
            .Select(module => new ModuleDto(module.Id, module.Name,
                module.Lessons.OrderBy(lesson => lesson.Position).ThenBy(lesson => lesson.Id)
                    .Select(lesson => new LessonDto(lesson.Id, lesson.Name, lesson.Description)).ToArray()))
            .ToArray());

    public async Task<CourseListDto> ListAsync(CourseQuery filters, CancellationToken cancellationToken)
    {
        var query = context.Courses.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var text = filters.Search.Trim().Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");
            var pattern = $"%{text}%";
            query = query.Where(course =>
                EF.Functions.ILike(EF.Functions.Unaccent(course.FullName), EF.Functions.Unaccent(pattern), "\\")
                || EF.Functions.ILike(EF.Functions.Unaccent(course.ShortName), EF.Functions.Unaccent(pattern), "\\")
                || EF.Functions.ILike(EF.Functions.Unaccent(course.Category.Name), EF.Functions.Unaccent(pattern), "\\"));
        }

        if (!string.IsNullOrWhiteSpace(filters.Category))
            query = query.Where(course => course.CategoryId == filters.Category.Trim());
        if (!string.IsNullOrEmpty(filters.Modality))
            query = query.Where(course => course.Modality == filters.Modality);
        if (!string.IsNullOrEmpty(filters.Status))
            query = query.Where(course => course.Status == filters.Status);

        var items = await query.OrderBy(course => course.FullName).ThenBy(course => course.Id)
            .AsSplitQuery().Select(Projection).ToListAsync(cancellationToken);
        return new CourseListDto(items, items.Count);
    }

    public Task<CourseDto?> GetByIdAsync(string id, CancellationToken cancellationToken) =>
        context.Courses.AsNoTracking().AsSplitQuery()
            .Where(course => course.Id == id)
            .Select(Projection).SingleOrDefaultAsync(cancellationToken);

    public async Task<IReadOnlyList<CategoryDto>> ListCategoriesAsync(CancellationToken cancellationToken) =>
        await context.Categories.AsNoTracking().OrderBy(category => category.Name).ThenBy(category => category.Id)
            .Select(category => new CategoryDto(category.Id, category.Name, category.Icon))
            .ToListAsync(cancellationToken);
}
