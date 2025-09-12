// backend/src/RealEstate.Domain/Entities/Property.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? _id { get; init; }

    [BsonElement("id")]
    public string Id { get; init; } = default!;

    [BsonElement("name")]
    public string Name { get; init; } = default!;

    [BsonElement("address")]
    public string Address { get; init; } = default!;

    [BsonElement("price")]
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; init; }

    [BsonElement("codeInternal")]
    public string CodeInternal { get; init; } = default!;

    [BsonElement("year")]
    public int Year { get; init; }

    [BsonElement("owner")]
    public Owner Owner { get; init; } = default!;

    [BsonElement("images")]
    public IReadOnlyList<PropertyImage> Images { get; init; } = Array.Empty<PropertyImage>();

    [BsonElement("traces")]
    public IReadOnlyList<PropertyTrace> Traces { get; init; } = Array.Empty<PropertyTrace>();
}
