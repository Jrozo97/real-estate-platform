// Application/Dto/PropertyDto.cs
namespace RealEstate.Application.Dto;

public sealed record PropertyDto(
    string Id,
    string IdOwner,
    string Name,
    string Address,
    decimal Price,
    string ImageUrl
);
