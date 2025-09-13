// backend/src/RealEstate.Domain/Entities/Property.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? _id { get; set; }

    [BsonElement("id")]
    public string Id { get; set; } = default!;

    [BsonElement("name")]
    public string Name { get; set; } = default!;

    [BsonElement("address")]
    public string Address { get; set; } = default!;

    [BsonElement("price")]
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; set; }

    [BsonElement("codeInternal")]
    public string CodeInternal { get; set; } = default!;

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("owner")]
    public Owner Owner { get; set; } = default!;

    [BsonElement("images")]
    public List<PropertyImage> Images { get; set; } = new();

    [BsonElement("traces")]
    public List<PropertyTrace> Traces { get; set; } = new();
}
