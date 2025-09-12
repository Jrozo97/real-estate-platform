// Owner.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class Owner
{
    [BsonElement("id")] public string Id { get; init; } = default!;
    [BsonElement("name")] public string Name { get; init; } = default!;
    [BsonElement("address")] public string Address { get; init; } = default!;
    [BsonElement("photo")] public string Photo { get; init; } = default!;
    [BsonElement("birthday")] public DateTime Birthday { get; init; }
}
