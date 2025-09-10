// Infrastructure/Mongo/Setup.cs (llamar una vez en startup si quieres)
using MongoDB.Driver;
using RealEstate.Domain.Entities;

public static class MongoSetup
{
    public static async Task EnsureIndexesAsync(IMongoDatabase db, CancellationToken ct)
    {
        var col = db.GetCollection<Property>("properties");
        var idx = new CreateIndexModel<Property>(
            Builders<Property>.IndexKeys.Ascending(p => p.Name).Ascending(p => p.Address).Ascending(p => p.Price),
            new CreateIndexOptions { Background = true, Name = "idx_name_address_price" });
        await col.Indexes.CreateOneAsync(idx, cancellationToken: ct);
    }
}
