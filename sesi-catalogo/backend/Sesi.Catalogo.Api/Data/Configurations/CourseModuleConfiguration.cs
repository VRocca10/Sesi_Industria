using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Data.Configurations;

public sealed class CourseModuleConfiguration : IEntityTypeConfiguration<CourseModule>
{
    public void Configure(EntityTypeBuilder<CourseModule> entity)
    {
        entity.ToTable("Modules", table => table.HasCheckConstraint("CK_Modules_Position", "\"Position\" > 0"));
        entity.HasKey(module => new { module.CourseId, module.Id });
        entity.Property(module => module.CourseId).HasMaxLength(150);
        entity.Property(module => module.Id).HasMaxLength(150);
        entity.Property(module => module.Name).HasMaxLength(200).IsRequired();
        entity.HasIndex(module => new { module.CourseId, module.Position }).IsUnique();

        entity.HasOne(module => module.Course)
            .WithMany(course => course.Modules)
            .HasForeignKey(module => module.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
