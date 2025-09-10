// WebApi/Program.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using RealEstate.Application.Abstractions;
using RealEstate.Application.Dto;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Mongo;

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

builder.Services.AddCors(o =>
    o.AddDefaultPolicy(p => p.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000")));

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

    var result = await repo.FindAsync(new PropertyFilter(name, address, minPrice, maxPrice, page, pageSize, sort), ct);

    var dto = result.Items.Select(p => new PropertyDto(p.Id, p.IdOwner, p.Name, p.Address, p.Price, p.ImageUrl));
    return Results.Ok(new
    {
        items = dto,
        page = result.Page,
        pageSize = result.PageSize,
        total = result.Total
    });
})
.WithName("GetProperties")
.Produces(200)
.ProducesProblem(400);

// GET /api/properties/{id}
app.MapGet("/api/properties/{id}", async (string id, IPropertyRepository repo, CancellationToken ct) =>
{
    var p = await repo.GetByIdAsync(id, ct);
    return p is null 
    ? Results.Problem(
        title: "Not Found", 
        statusCode: StatusCodes.Status404NotFound
      )
    : Results.Ok(new PropertyDto(
        p.Id, 
        p.IdOwner, 
        p.Name, 
        p.Address, 
        p.Price, 
        p.ImageUrl
      ));
})
.WithName("GetPropertyById")
.Produces(200)
.ProducesProblem(404);

app.Run();
