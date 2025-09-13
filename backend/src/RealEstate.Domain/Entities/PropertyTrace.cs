// PropertyTrace.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class PropertyTrace
{
    [BsonElement("id")] public string Id { get; set; } = default!;
    [BsonElement("dateSale")] public DateTime DateSale { get; set; }
    [BsonElement("name")] public string Name { get; set; } = default!;
    [BsonElement("value")][BsonRepresentation(BsonType.Decimal128)] public decimal Value { get; set; }
    [BsonElement("tax")][BsonRepresentation(BsonType.Decimal128)] public decimal Tax { get; set; }
}
