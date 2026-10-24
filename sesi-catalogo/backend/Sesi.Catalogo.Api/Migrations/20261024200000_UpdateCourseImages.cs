using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Sesi.Catalogo.Api.Data;

#nullable disable

namespace Sesi.Catalogo.Api.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20261024200000_UpdateCourseImages")]
public partial class UpdateCourseImages : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
            UPDATE "Courses" SET "Image" = '/assets/courses/matematica-precisao.jpg' WHERE "Id" = 'matematica-precisao' AND "Image" = '/assets/banner-ava.webp';
            UPDATE "Courses" SET "Image" = '/assets/courses/geometria-textil.jpg' WHERE "Id" = 'geometria-textil' AND "Image" = '/assets/hero-image-960.webp';
            UPDATE "Courses" SET "Image" = '/assets/courses/estatistica-qualidade.jpg' WHERE "Id" = 'estatistica-qualidade' AND "Image" = '/assets/video-thumb-960.webp';
            UPDATE "Courses" SET "Image" = '/assets/courses/fisica-metalurgia.jpg' WHERE "Id" = 'fisica-metalurgia' AND "Image" = '/assets/video-thumb-960.webp';
            UPDATE "Courses" SET "Image" = '/assets/courses/quimica-sustentabilidade.jpg' WHERE "Id" = 'quimica-sustentabilidade' AND "Image" = '/assets/banner-ava.webp';
            UPDATE "Courses" SET "Image" = '/assets/courses/comunicacao-industria.jpg' WHERE "Id" = 'comunicacao-industria' AND "Image" = '/assets/hero-image-960.webp';
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
            UPDATE "Courses" SET "Image" = '/assets/banner-ava.webp' WHERE "Id" = 'matematica-precisao' AND "Image" = '/assets/courses/matematica-precisao.jpg';
            UPDATE "Courses" SET "Image" = '/assets/hero-image-960.webp' WHERE "Id" = 'geometria-textil' AND "Image" = '/assets/courses/geometria-textil.jpg';
            UPDATE "Courses" SET "Image" = '/assets/video-thumb-960.webp' WHERE "Id" = 'estatistica-qualidade' AND "Image" = '/assets/courses/estatistica-qualidade.jpg';
            UPDATE "Courses" SET "Image" = '/assets/video-thumb-960.webp' WHERE "Id" = 'fisica-metalurgia' AND "Image" = '/assets/courses/fisica-metalurgia.jpg';
            UPDATE "Courses" SET "Image" = '/assets/banner-ava.webp' WHERE "Id" = 'quimica-sustentabilidade' AND "Image" = '/assets/courses/quimica-sustentabilidade.jpg';
            UPDATE "Courses" SET "Image" = '/assets/hero-image-960.webp' WHERE "Id" = 'comunicacao-industria' AND "Image" = '/assets/courses/comunicacao-industria.jpg';
            """);
    }
}
