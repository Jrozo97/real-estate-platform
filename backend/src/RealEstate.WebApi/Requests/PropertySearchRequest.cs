namespace RealEstate.WebApi.Requests;

public sealed record PropertySearchRequest(
    string? Name,
    string? Address,
    decimal? MinPrice,
    decimal? MaxPrice,
    int Page = 1,
    int PageSize = 12,
    string? Sort = null // "price:asc|desc", "name:asc|desc", "year:desc"
);