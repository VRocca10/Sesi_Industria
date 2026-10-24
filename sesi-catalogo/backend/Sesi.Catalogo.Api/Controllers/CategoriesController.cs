using Microsoft.AspNetCore.Mvc;
using Sesi.Catalogo.Api.DTOs;
using Sesi.Catalogo.Api.Services;

namespace Sesi.Catalogo.Api.Controllers;

[ApiController]
[Route("api/categories")]
public sealed class CategoriesController(CourseCatalogService catalog) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<CategoryDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> List(CancellationToken cancellationToken) =>
        Ok(await catalog.ListCategoriesAsync(cancellationToken));
}
