// Domain/Entities/Property.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

public sealed class Property
{
    // Mapea el _id interno de Mongo
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? _id { get; init; }

    // Este es tu identificador de negocio 
    public string Id { get; init; } = default!;

    public string IdOwner { get; init; } = default!;
    public string Name { get; init; } = default!;
    public string Address { get; init; } = default!;

    // Permite convertir desde Int32/Int64/Double de BSON a decimal en C#
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; init; }

    public string ImageUrl { get; init; } = default!;
}
