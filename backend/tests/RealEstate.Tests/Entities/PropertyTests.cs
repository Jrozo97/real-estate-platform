using NUnit.Framework;
using RealEstate.Domain.Entities;
using System;
using System.Collections.Generic;

namespace RealEstate.Tests.Entities;

public class PropertyTests
{
    [Test]
    public void Property_Should_Hold_Images_And_Traces()
    {
        var prop = new Property
        {
            Id = "P-001",
            Name = "Casa San Martín",
            Address = "Cra 15 #45-10, Bogotá",
            Price = 450_000_000m,
            CodeInternal = "C-0001",
            Year = 2015,
            Owner = new Owner
            {
                Id = "O-100",
                Name = "Juan Pérez",
                Address = "Bogotá",
                Photo = "https://example.com/owner.jpg",
                Birthday = new DateTime(1985, 3, 10)
            },
            Images = new List<PropertyImage>
            {
                new() { Id = "PI-001", File = "https://imgs/1.jpg", Enabled = true },
                new() { Id = "PI-002", File = "https://imgs/2.jpg", Enabled = false }
            },
            Traces = new List<PropertyTrace>
            {
                new() { Id = "T-001", DateSale = new DateTime(2022, 1, 15), Name = "Venta", Value = 420_000_000m, Tax = 0.05m }
            }
        };

        Assert.That(prop.Id, Is.EqualTo("P-001"));
        Assert.That(prop.Owner.Id, Is.EqualTo("O-100"));
        Assert.That(prop.Images, Has.Count.EqualTo(2));
        Assert.That(prop.Images[0].Enabled, Is.True);
        Assert.That(prop.Traces, Has.Count.EqualTo(1));
        Assert.That(prop.Traces[0].Value, Is.EqualTo(420_000_000m));
    }
}
