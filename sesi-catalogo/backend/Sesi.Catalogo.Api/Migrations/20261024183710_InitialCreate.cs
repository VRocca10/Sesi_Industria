using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sesi.Catalogo.Api.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Icon = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    FullName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    ShortName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CategoryId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Modality = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    WorkloadHours = table.Column<int>(type: "integer", nullable: false),
                    TargetAudience = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Image = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    AvailableFrom = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                    table.CheckConstraint("CK_Courses_Modality", "\"Modality\" IN ('A distância', 'Semipresencial')");
                    table.CheckConstraint("CK_Courses_Status", "\"Status\" IN ('Disponível', 'Em breve', 'Encerrado')");
                    table.CheckConstraint("CK_Courses_WorkloadHours", "\"WorkloadHours\" > 0");
                    table.ForeignKey(
                        name: "FK_Courses_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Modules",
                columns: table => new
                {
                    CourseId = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Id = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => new { x.CourseId, x.Id });
                    table.CheckConstraint("CK_Modules_Position", "\"Position\" > 0");
                    table.ForeignKey(
                        name: "FK_Modules_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    CourseId = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ModuleId = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Id = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => new { x.CourseId, x.ModuleId, x.Id });
                    table.CheckConstraint("CK_Lessons_Position", "\"Position\" > 0");
                    table.ForeignKey(
                        name: "FK_Lessons_Modules_CourseId_ModuleId",
                        columns: x => new { x.CourseId, x.ModuleId },
                        principalTable: "Modules",
                        principalColumns: new[] { "CourseId", "Id" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CategoryId",
                table: "Courses",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_CourseId_ModuleId_Position",
                table: "Lessons",
                columns: new[] { "CourseId", "ModuleId", "Position" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Modules_CourseId_Position",
                table: "Modules",
                columns: new[] { "CourseId", "Position" },
                unique: true);
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Modules");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
