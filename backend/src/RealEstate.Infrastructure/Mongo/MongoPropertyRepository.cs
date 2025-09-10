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
        var filter = Builders<Property>.Filter.Empty;

        if (!string.IsNullOrWhiteSpace(f.Name))
            filter &= Builders<Property>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(f.Name, "i"));

        if (!string.IsNullOrWhiteSpace(f.Address))
            filter &= Builders<Property>.Filter.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(f.Address, "i"));

        if (f.MinPrice is not null)
            filter &= Builders<Property>.Filter.Gte(p => p.Price, f.MinPrice.Value);

        if (f.MaxPrice is not null)
            filter &= Builders<Property>.Filter.Lte(p => p.Price, f.MaxPrice.Value);

        var query = _col.Find(filter);

        // sort
        if (!string.IsNullOrEmpty(f.Sort))
        {
            var parts = f.Sort.Split(':');
            var field = parts[0].ToLowerInvariant();
            var dir = parts.Length > 1 && parts[1].Equals("desc", StringComparison.OrdinalIgnoreCase) ? -1 : 1;
            var sort = field switch
            {
                "price" => dir == 1 ? Builders<Property>.Sort.Ascending(p => p.Price) : Builders<Property>.Sort.Descending(p => p.Price),
                "name"  => dir == 1 ? Builders<Property>.Sort.Ascending(p => p.Name)  : Builders<Property>.Sort.Descending(p => p.Name),
                _ => Builders<Property>.Sort.Ascending(p => p.Name)
            };
            query = query.Sort(sort);
        }

        var total = await query.CountDocumentsAsync(ct);
        var page = Math.Max(f.Page, 1);
        var size = Math.Clamp(f.PageSize, 1, 100);

        var items = await query
            .Skip((page - 1) * size)
            .Limit(size)
            .Project(p => new Property // proyección mínima (performance)
            {
                Id = p.Id,
                IdOwner = p.IdOwner,
                Name = p.Name,
                Address = p.Address,
                Price = p.Price,
                ImageUrl = p.ImageUrl
            })
            .ToListAsync(ct);

        return new PagedResult<Property>(items, total, page, size);
    }

    public Task<Property?> GetByIdAsync(string id, CancellationToken ct)
        => _col.Find(p => p.Id == id).FirstOrDefaultAsync(ct)!;
}
