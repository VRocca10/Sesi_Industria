using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Data.Configurations;

public sealed class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> entity)
    {
        entity.ToTable("Courses", table =>
        {
            table.HasCheckConstraint("CK_Courses_WorkloadHours", "\"WorkloadHours\" > 0");
            table.HasCheckConstraint("CK_Courses_Modality", "\"Modality\" IN ('A distância', 'Semipresencial')");
            table.HasCheckConstraint("CK_Courses_Status", "\"Status\" IN ('Disponível', 'Em breve', 'Encerrado')");
        });

        entity.HasKey(course => course.Id);
        entity.Property(course => course.Id).HasMaxLength(150);
        entity.Property(course => course.FullName).HasMaxLength(300).IsRequired();
        entity.Property(course => course.ShortName).HasMaxLength(150).IsRequired();
        entity.Property(course => course.Description).IsRequired();
        entity.Property(course => course.CategoryId).HasMaxLength(100).IsRequired();
        entity.Property(course => course.Modality).HasMaxLength(50).IsRequired();
        entity.Property(course => course.TargetAudience).IsRequired();
        entity.Property(course => course.Status).HasMaxLength(30).IsRequired();
        entity.Property(course => course.Image).HasMaxLength(500).IsRequired();

        entity.HasOne(course => course.Category)
            .WithMany(category => category.Courses)
            .HasForeignKey(course => course.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
