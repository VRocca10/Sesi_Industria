using Microsoft.EntityFrameworkCore;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.Data.Seed;
using Sesi.Catalogo.Api.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Configure ConnectionStrings:DefaultConnection antes de iniciar a API.");

builder.Services.AddDbContext<AppDbContext>(options => options
    .UseNpgsql(connectionString)
    .UseSeeding((context, _) => CatalogSeeder.Seed((AppDbContext)context))
    .UseAsyncSeeding((context, _, cancellationToken) => CatalogSeeder.SeedAsync((AppDbContext)context, cancellationToken)));
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<CourseCatalogService>();
builder.Services.AddProblemDetails();
var frontendOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
{
    if (frontendOrigins.Length > 0)
        policy.WithOrigins(frontendOrigins).WithMethods("GET").AllowAnyHeader();
}));

var app = builder.Build();
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
