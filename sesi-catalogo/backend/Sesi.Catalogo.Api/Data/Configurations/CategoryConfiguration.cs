using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Data.Configurations;

public sealed class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> entity)
    {
        entity.ToTable("Categories");
        entity.HasKey(category => category.Id);
        entity.Property(category => category.Id).HasMaxLength(100);
        entity.Property(category => category.Name).HasMaxLength(150).IsRequired();
        entity.Property(category => category.Icon).HasMaxLength(500).IsRequired();
    }
}
