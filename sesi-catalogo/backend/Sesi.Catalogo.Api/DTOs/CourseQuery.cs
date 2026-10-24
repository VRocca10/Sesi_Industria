using System.ComponentModel.DataAnnotations;

namespace Sesi.Catalogo.Api.DTOs;

public sealed class CourseQuery
{
    [MaxLength(200, ErrorMessage = "A pesquisa deve ter no máximo 200 caracteres.")]
    public string? Search { get; init; }

    [MaxLength(100, ErrorMessage = "A categoria deve ter no máximo 100 caracteres.")]
    public string? Category { get; init; }

    [RegularExpression("^(A distância|Semipresencial)$", ErrorMessage = "Modalidade inválida. Utilize A distância ou Semipresencial.")]
    public string? Modality { get; init; }

    [RegularExpression("^(Disponível|Em breve|Encerrado)$", ErrorMessage = "Status inválido. Utilize Disponível, Em breve ou Encerrado.")]
    public string? Status { get; init; }
}
