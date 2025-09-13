// Owner.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class Owner
{
    [BsonElement("id")] public string Id { get; set; } = default!;
    [BsonElement("name")] public string Name { get; set; } = default!;
    [BsonElement("address")] public string Address { get; set; } = default!;
    [BsonElement("photo")] public string Photo { get; set; } = default!;
    [BsonElement("birthday")] public DateTime Birthday { get; set; }
}
