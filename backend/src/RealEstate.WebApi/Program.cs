// WebApi/Program.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using RealEstate.Application.Abstractions;
using RealEstate.Application.Dto;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Mongo;
using RealEstate.WebApi.Requests;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "RealEstate API", Version = "v1" }));

// Mongo
var mongoConn = builder.Configuration["MONGO_URI"] ?? "mongodb://localhost:27017";
var mongoClient = new MongoClient(mongoConn);
builder.Services.AddSingleton<IMongoDatabase>(mongoClient.GetDatabase("realestate_db"));

// DI
builder.Services.AddScoped<IPropertyRepository, MongoPropertyRepository>();

// CORS Validation
var frontendUrl = builder.Configuration["FRONTEND_URL"] ??
                  Environment.GetEnvironmentVariable("FRONTEND_URL") ??
                  "http://localhost:3000";

var allowedOrigins = new List<string>();

// Validar y agregar URL principal
if (!string.IsNullOrEmpty(frontendUrl) &&
    Uri.IsWellFormedUriString(frontendUrl, UriKind.Absolute))
{
    allowedOrigins.Add(frontendUrl);

    // Agregar variante con/sin www si es necesario
    if (frontendUrl.Contains(".onrender.com") && !frontendUrl.Contains("www."))
    {
        var wwwVersion = frontendUrl.Replace("https://", "https://www.");
        allowedOrigins.Add(wwwVersion);
    }
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Any())
        {
            policy.WithOrigins(allowedOrigins.ToArray())
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Agregué esto por si usas auth/cookies
        }
        else
        {
            Console.WriteLine("⚠️ ADVERTENCIA: No hay orígenes CORS válidos configurados");
            if (builder.Environment.IsDevelopment())
            {
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            }
            else
            {
                throw new InvalidOperationException("No se configuraron orígenes CORS válidos para producción");
            }
        }
    });
});




builder.Services.AddProblemDetails();
var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



// GET /api/properties
// GET /api/properties (listado)
app.MapGet("/api/properties", async (
    IPropertyRepository repo,
    CancellationToken ct,
    [FromQuery] string? name,
    [FromQuery] string? address,
    [FromQuery] decimal? minPrice,
    [FromQuery] decimal? maxPrice,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 12,
    [FromQuery] string? sort = null
) =>
{
    if (minPrice is > 0 && maxPrice is > 0 && minPrice > maxPrice)
        return Results.Problem(
            title: "Invalid price range",
            detail: "minPrice cannot be greater than maxPrice",
            statusCode: StatusCodes.Status400BadRequest
        );

    var result = await repo.FindAsync(
        new PropertyFilter(name, address, minPrice, maxPrice, page, pageSize, sort), ct
    );

    // 🔁 Mapeo entidad -> DTO COMPLETO
    var items = result.Items.Select(p => new PropertyDetailDto(
        p.Id,
        p.Name,
        p.Address,
        p.Price,
        p.CodeInternal,
        p.Year,
        new OwnerDto(p.Owner.Id, p.Owner.Name, p.Owner.Address, p.Owner.Photo, p.Owner.Birthday),
        p.Images.Select(i => new ImageDto(i.Id, i.File, i.Enabled)).ToList(),
        p.Traces.Select(t => new TraceDto(t.Id, t.DateSale, t.Name, t.Value, t.Tax)).ToList()
    ));

    return Results.Ok(new
    {
        items,
        page = result.Page,
        pageSize = result.PageSize,
        total = result.Total
    });
})
.WithName("GetProperties")
.Produces(200)
.ProducesProblem(400);

// GET /api/properties/meta (metadatos: minPrice, maxPrice)
app.MapGet("/api/properties/meta", async (IMongoDatabase db, CancellationToken ct) =>
{
    var col = db.GetCollection<Property>("properties");
    var min = await col.AsQueryable().Select(p => p.Price).MinAsync(ct);
    var max = await col.AsQueryable().Select(p => p.Price).MaxAsync(ct);
    return Results.Ok(new { minPrice = min, maxPrice = max });
}).
WithName("GetPropertiesMeta")
.Produces(200)
.ProducesProblem(400);

// GET /api/properties/{id} (detalle)
app.MapGet("/api/properties/{id}", async (string id, IPropertyRepository repo, CancellationToken ct) =>
{
    var p = await repo.GetByIdAsync(id, ct);
    if (p is null)
        return Results.Problem(title: "Not Found", statusCode: StatusCodes.Status404NotFound);

    // Mapeo entidad -> DTO de detalle
    var dto = new PropertyDetailDto(
        p.Id,
        p.Name,
        p.Address,
        p.Price,
        p.CodeInternal,
        p.Year,
        new OwnerDto(p.Owner.Id, p.Owner.Name, p.Owner.Address, p.Owner.Photo, p.Owner.Birthday),
        p.Images.Select(i => new ImageDto(i.Id, i.File, i.Enabled)).ToList(),
        p.Traces.Select(t => new TraceDto(t.Id, t.DateSale, t.Name, t.Value, t.Tax)).ToList()
    );

    return Results.Ok(dto);
})
.WithName("GetPropertyById")
.Produces(200)
.ProducesProblem(404);

// POST /api/properties/search (búsqueda avanzada)
app.MapPost("/api/properties/search", async (
    PropertySearchRequest body,
    IPropertyRepository repo,
    CancellationToken ct) =>
{
    if (body.MinPrice is > 0 && body.MaxPrice is > 0 && body.MinPrice > body.MaxPrice)
        return Results.Problem(title: "Invalid price range", detail: "minPrice cannot be greater than maxPrice", statusCode: 400);

    var result = await repo.FindAsync(
        new PropertyFilter(body.Name, body.Address, body.MinPrice, body.MaxPrice, body.Page, body.PageSize, body.Sort), ct
    );

    var items = result.Items.Select(p => new PropertyDetailDto(
        p.Id, p.Name, p.Address, p.Price, p.CodeInternal, p.Year,
        new OwnerDto(p.Owner.Id, p.Owner.Name, p.Owner.Address, p.Owner.Photo, p.Owner.Birthday),
        p.Images.Select(i => new ImageDto(i.Id, i.File, i.Enabled)).ToList(),
        p.Traces.Select(t => new TraceDto(t.Id, t.DateSale, t.Name, t.Value, t.Tax)).ToList()
    ));

    return Results.Ok(new { items, page = result.Page, pageSize = result.PageSize, total = result.Total });
})
.WithName("SearchProperties")
.Produces(200)
.ProducesProblem(400);





app.Run();
