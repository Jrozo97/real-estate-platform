// Infrastructure/Mongo/MongoPropertyRepository.cs
using MongoDB.Driver;
using RealEstate.Application.Abstractions;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Mongo;

public sealed class MongoPropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _col;

    public MongoPropertyRepository(IMongoDatabase db)
        => _col = db.GetCollection<Property>("properties");

    public async Task<PagedResult<Property>> FindAsync(PropertyFilter f, CancellationToken ct)
    {
        var builder = Builders<Property>.Filter;
        var filter = builder.Empty;

        if (!string.IsNullOrWhiteSpace(f.Name))
            filter &= builder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(f.Name, "i"));

        if (!string.IsNullOrWhiteSpace(f.Address))
            filter &= builder.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(f.Address, "i"));

        if (f.MinPrice is not null)
            filter &= builder.Gte(p => p.Price, f.MinPrice.Value); // ← decimal

        if (f.MaxPrice is not null)
            filter &= builder.Lte(p => p.Price, f.MaxPrice.Value); // ← decimal

        var query = _col.Find(filter);

        if (!string.IsNullOrEmpty(f.Sort))
        {
            var parts = f.Sort.Split(':');
            var field = parts[0].ToLowerInvariant();
            var desc = parts.Length > 1 && parts[1].Equals("desc", StringComparison.OrdinalIgnoreCase);

            var sort = field switch
            {
                "price" => desc ? Builders<Property>.Sort.Descending(p => p.Price)
                                : Builders<Property>.Sort.Ascending(p => p.Price),
                "name"  => desc ? Builders<Property>.Sort.Descending(p => p.Name)
                                : Builders<Property>.Sort.Ascending(p => p.Name),
                _       => Builders<Property>.Sort.Ascending(p => p.Name)
            };
            query = query.Sort(sort);
        }

        var total = await query.CountDocumentsAsync(ct);
        var page = Math.Max(f.Page, 1);
        var size = Math.Clamp(f.PageSize, 1, 100);

        var items = await query
            .Skip((page - 1) * size)
            .Limit(size)
            .ToListAsync(ct); // ← sin Project

        return new PagedResult<Property>(items, total, page, size);
    }

    public Task<Property?> GetByIdAsync(string id, CancellationToken ct)
        => _col.Find(p => p.Id == id).FirstOrDefaultAsync(ct)!;

    // (Si no usas estos métodos, puedes eliminarlos para evitar duplicidad)
    public async Task<PagedResult<Property>> SearchAsync(
        string? name, string? address, long? minPrice, long? maxPrice, int page, int pageSize)
    {
        var builder = Builders<Property>.Filter;
        var filter = builder.Empty;

        if (!string.IsNullOrWhiteSpace(name))
            filter &= builder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(name, "i"));

        if (!string.IsNullOrWhiteSpace(address))
            filter &= builder.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(address, "i"));

        if (minPrice is not null)
            filter &= builder.Gte(p => p.Price, (decimal)minPrice.Value);

        if (maxPrice is not null)
            filter &= builder.Lte(p => p.Price, (decimal)maxPrice.Value);

        var query = _col.Find(filter);

        var total = await query.CountDocumentsAsync();
        var currentPage = Math.Max(page, 1);
        var size = Math.Clamp(pageSize, 1, 100);

        var items = await query
            .Skip((currentPage - 1) * size)
            .Limit(size)
            .ToListAsync();

        return new PagedResult<Property>(items, total, currentPage, size);
    }

    public Task<Property?> GetByBusinessIdAsync(string businessId)
        => _col.Find(p => p.CodeInternal == businessId).FirstOrDefaultAsync()!;
}
