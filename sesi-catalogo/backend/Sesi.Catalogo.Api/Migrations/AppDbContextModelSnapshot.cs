using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Sesi.Catalogo.Api.Data;

#nullable disable

namespace Sesi.Catalogo.Api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "10.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.HasPostgresExtension(modelBuilder, "unaccent");
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.Category", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Icon")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.HasKey("Id");

                    b.ToTable("Categories", (string)null);
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.Course", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<DateOnly?>("AvailableFrom")
                        .HasColumnType("date");

                    b.Property<string>("CategoryId")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)");

                    b.Property<string>("Modality")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("ShortName")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("character varying(30)");

                    b.Property<string>("TargetAudience")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("WorkloadHours")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.ToTable("Courses", null, t =>
                        {
                            t.HasCheckConstraint("CK_Courses_Modality", "\"Modality\" IN ('A distância', 'Semipresencial')");

                            t.HasCheckConstraint("CK_Courses_Status", "\"Status\" IN ('Disponível', 'Em breve', 'Encerrado')");

                            t.HasCheckConstraint("CK_Courses_WorkloadHours", "\"WorkloadHours\" > 0");
                        });
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.CourseModule", b =>
                {
                    b.Property<string>("CourseId")
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<string>("Id")
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<int>("Position")
                        .HasColumnType("integer");

                    b.HasKey("CourseId", "Id");

                    b.HasIndex("CourseId", "Position")
                        .IsUnique();

                    b.ToTable("Modules", null, t =>
                        {
                            t.HasCheckConstraint("CK_Modules_Position", "\"Position\" > 0");
                        });
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.Lesson", b =>
                {
                    b.Property<string>("CourseId")
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<string>("ModuleId")
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<string>("Id")
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<int>("Position")
                        .HasColumnType("integer");

                    b.HasKey("CourseId", "ModuleId", "Id");

                    b.HasIndex("CourseId", "ModuleId", "Position")
                        .IsUnique();

                    b.ToTable("Lessons", null, t =>
                        {
                            t.HasCheckConstraint("CK_Lessons_Position", "\"Position\" > 0");
                        });
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.Course", b =>
                {
                    b.HasOne("Sesi.Catalogo.Api.Models.Category", "Category")
                        .WithMany("Courses")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Category");
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.CourseModule", b =>
                {
                    b.HasOne("Sesi.Catalogo.Api.Models.Course", "Course")
                        .WithMany("Modules")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.Lesson", b =>
                {
                    b.HasOne("Sesi.Catalogo.Api.Models.CourseModule", "Module")
                        .WithMany("Lessons")
                        .HasForeignKey("CourseId", "ModuleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Module");
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.Category", b =>
                {
                    b.Navigation("Courses");
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.Course", b =>
                {
                    b.Navigation("Modules");
                });

            modelBuilder.Entity("Sesi.Catalogo.Api.Models.CourseModule", b =>
                {
                    b.Navigation("Lessons");
                });
#pragma warning restore 612, 618
        }
    }
}
