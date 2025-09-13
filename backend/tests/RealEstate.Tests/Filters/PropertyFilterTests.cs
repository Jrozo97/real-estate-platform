using NUnit.Framework;
using RealEstate.Application.Abstractions;

namespace RealEstate.Tests.Filters;

public class PropertyFilterTests
{
    [Test]
    public void Filter_Should_Keep_All_Values()
    {
        var f = new PropertyFilter(
            Name: "Casa",
            Address: "Bogotá",
            MinPrice: 300_000_000m,
            MaxPrice: 600_000_000m,
            Page: 2,
            PageSize: 12,
            Sort: "price:desc"
        );

        Assert.That(f.Name, Is.EqualTo("Casa"));
        Assert.That(f.Address, Is.EqualTo("Bogotá"));
        Assert.That(f.MinPrice, Is.EqualTo(300_000_000m));
        Assert.That(f.MaxPrice, Is.EqualTo(600_000_000m));
        Assert.That(f.Page, Is.EqualTo(2));
        Assert.That(f.PageSize, Is.EqualTo(12));
        Assert.That(f.Sort, Is.EqualTo("price:desc"));
    }

    [Test]
    public void Filter_With_Nulls_Is_Valid()
    {
        var f = new PropertyFilter(null, null, null, null, 1, 10, null);

        Assert.That(f.Name, Is.Null);
        Assert.That(f.Address, Is.Null);
        Assert.That(f.MinPrice, Is.Null);
        Assert.That(f.MaxPrice, Is.Null);
        Assert.That(f.Page, Is.EqualTo(1));
        Assert.That(f.PageSize, Is.EqualTo(10));
        Assert.That(f.Sort, Is.Null);
    }
}
