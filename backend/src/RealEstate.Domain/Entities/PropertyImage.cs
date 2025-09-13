// PropertyImage.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class PropertyImage
{
    [BsonElement("id")] public string Id { get; set; } = default!;
    [BsonElement("file")] public string File { get; set; } = default!;
    [BsonElement("enabled")] public bool Enabled { get; set; } 
}
