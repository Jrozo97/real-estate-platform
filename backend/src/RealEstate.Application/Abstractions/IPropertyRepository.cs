using RealEstate.Domain.Entities;   // ← importante

namespace RealEstate.Application.Abstractions;

public sealed record PropertyFilter(
    string? Name = null,
    string? Address = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    int Page = 1,
    int PageSize = 12,
    string? Sort = null
);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, long Total, int Page, int PageSize);

public interface IPropertyRepository
{
    Task<PagedResult<Property>> FindAsync(PropertyFilter filter, CancellationToken ct);
    Task<Property?> GetByIdAsync(string id, CancellationToken ct);
}
