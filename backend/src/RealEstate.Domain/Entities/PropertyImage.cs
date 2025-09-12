// PropertyImage.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class PropertyImage
{
    [BsonElement("id")] public string Id { get; init; } = default!;
    [BsonElement("file")] public string File { get; init; } = default!;
    [BsonElement("enabled")] public bool Enabled { get; init; }
}
