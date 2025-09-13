using NUnit.Framework;
using RealEstate.Domain.Entities;
using System;

namespace RealEstate.Tests.Entities;

public class OwnerTests
{
    [Test]
    public void Owner_ShouldHaveValidId()
    {
        var owner = new Owner
        {
            Id = "O-001",
            Name = "Juan Pérez",
            Address = "Bogotá",
            Photo = "https://picsum.photos/200/200",
            Birthday = new DateTime(1985, 3, 10)
        };

        Assert.That(owner.Id, Is.EqualTo("O-001"));
        Assert.That(owner.Name, Is.EqualTo("Juan Pérez"));
        Assert.That(owner.Birthday.Year, Is.InRange(1970, 2000));
    }
}
