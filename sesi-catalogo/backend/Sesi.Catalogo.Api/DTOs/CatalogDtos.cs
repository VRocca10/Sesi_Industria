namespace Sesi.Catalogo.Api.DTOs;

public sealed record CategoryDto(string Id, string Name, string Icon);

public sealed record LessonDto(string Id, string Name, string Description);

public sealed record ModuleDto(string Id, string Name, IReadOnlyList<LessonDto> Lessons);

public sealed record CourseDto(
    string Id,
    string FullName,
    string ShortName,
    string Description,
    CategoryDto Category,
    string Modality,
    int WorkloadHours,
    string TargetAudience,
    string Status,
    string Image,
    DateOnly? AvailableFrom,
    IReadOnlyList<ModuleDto> Modules);

public sealed record CourseListDto(IReadOnlyList<CourseDto> Items, int Total);
