namespace RealEstate.Application.Dto;

public sealed record PropertyListDto(
    string Id,
    string Name,
    string Address,
    decimal Price,
    string CodeInternal,
    int Year,
    string? MainImage,
    string OwnerName
);
