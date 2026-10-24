using Microsoft.AspNetCore.Mvc;
using Sesi.Catalogo.Api.DTOs;
using Sesi.Catalogo.Api.Services;

namespace Sesi.Catalogo.Api.Controllers;

[ApiController]
[Route("api/courses")]
public sealed class CoursesController(CourseCatalogService catalog) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<CourseListDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CourseListDto>> List([FromQuery] CourseQuery query, CancellationToken cancellationToken) =>
        Ok(await catalog.ListAsync(query, cancellationToken));

    [HttpGet("{id}")]
    [ProducesResponseType<CourseDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CourseDto>> GetById(string id, CancellationToken cancellationToken)
    {
        var course = await catalog.GetByIdAsync(id, cancellationToken);
        return course is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Curso não encontrado.")
            : Ok(course);
    }
}
