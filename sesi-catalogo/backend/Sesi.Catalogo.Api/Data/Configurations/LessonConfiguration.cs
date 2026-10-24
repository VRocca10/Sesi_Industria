using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Data.Configurations;

public sealed class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> entity)
    {
        entity.ToTable("Lessons", table => table.HasCheckConstraint("CK_Lessons_Position", "\"Position\" > 0"));
        entity.HasKey(lesson => new { lesson.CourseId, lesson.ModuleId, lesson.Id });
        entity.Property(lesson => lesson.CourseId).HasMaxLength(150);
        entity.Property(lesson => lesson.ModuleId).HasMaxLength(150);
        entity.Property(lesson => lesson.Id).HasMaxLength(150);
        entity.Property(lesson => lesson.Name).HasMaxLength(200).IsRequired();
        entity.Property(lesson => lesson.Description).IsRequired();
        entity.HasIndex(lesson => new { lesson.CourseId, lesson.ModuleId, lesson.Position }).IsUnique();

        entity.HasOne(lesson => lesson.Module)
            .WithMany(module => module.Lessons)
            .HasForeignKey(lesson => new { lesson.CourseId, lesson.ModuleId })
            .OnDelete(DeleteBehavior.Cascade);
    }
}
