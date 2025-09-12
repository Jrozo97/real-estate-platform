namespace RealEstate.Application.Dto;

public sealed record PropertyDetailDto(
    string Id,
    string Name,
    string Address,
    decimal Price,
    string CodeInternal,
    int Year,
    OwnerDto Owner,
    IReadOnlyList<ImageDto> Images,
    IReadOnlyList<TraceDto> Traces
);

public sealed record OwnerDto(string Id, string Name, string Address, string Photo, DateTime Birthday);
public sealed record ImageDto(string Id, string File, bool Enabled);
public sealed record TraceDto(string Id, DateTime DateSale, string Name, decimal Value, decimal Tax);
