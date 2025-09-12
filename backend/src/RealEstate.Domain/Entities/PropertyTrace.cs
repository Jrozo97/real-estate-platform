// PropertyTrace.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class PropertyTrace
{
    [BsonElement("id")] public string Id { get; init; } = default!;
    [BsonElement("dateSale")] public DateTime DateSale { get; init; }
    [BsonElement("name")] public string Name { get; init; } = default!;
    [BsonElement("value")][BsonRepresentation(BsonType.Decimal128)] public decimal Value { get; init; }
    [BsonElement("tax")][BsonRepresentation(BsonType.Decimal128)] public decimal Tax { get; init; }
}
