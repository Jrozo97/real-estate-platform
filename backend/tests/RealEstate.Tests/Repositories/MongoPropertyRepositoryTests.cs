using NUnit.Framework;
using Mongo2Go;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Mongo;
using RealEstate.Application.Abstractions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealEstate.Tests.Repositories;

public class MongoPropertyRepositoryTests
{
    private MongoDbRunner _runner = null!;
    private IMongoDatabase _db = null!;
    private MongoPropertyRepository _repo = null!;

    [OneTimeSetUp]
    public void OneTimeSetup()
    {
        // Arranca Mongo embebido
        _runner = MongoDbRunner.Start(singleNodeReplSet: true);
        var client = new MongoClient(_runner.ConnectionString);
        _db = client.GetDatabase("realestate_test");

        // IMPORTANTe: registra convenciones/clasemaps si tu infra lo requiere
        // MongoSetup.Register(); // si tienes este método en tu infra

        _repo = new MongoPropertyRepository(_db);
    }

    [SetUp]
    public async Task Setup()
    {
        // Limpia y seed
        var col = _db.GetCollection<Property>("properties");
        await col.DeleteManyAsync(FilterDefinition<Property>.Empty);

        var seed = new List<Property>
        {
            new()
            {
                Id = "P-001", Name = "Casa Norte", Address = "Calle 10 #1-23, Bogotá",
                Price = 500_000_000m, CodeInternal = "C-001", Year = 2018,
                Owner = new Owner { Id = "O-001", Name = "Ana", Address = "Bogotá", Photo = "https://p/1.jpg", Birthday = new DateTime(1990,1,1) },
                Images = new List<PropertyImage> { new() { Id = "PI-1", File = "https://i/1.jpg", Enabled = true } },
                Traces = new List<PropertyTrace> { new() { Id = "T-1", DateSale = DateTime.UtcNow, Name="Compra", Value=480_000_000m, Tax=0.04m } }
            },
            new()
            {
                Id = "P-002", Name = "Apto Centro", Address = "Cra 7 #50-20, Medellín",
                Price = 350_000_000m, CodeInternal = "C-002", Year = 2015,
                Owner = new Owner { Id = "O-002", Name = "Luis", Address = "Medellín", Photo = "https://p/2.jpg", Birthday = new DateTime(1988,5,5) },
                Images = new List<PropertyImage> { new() { Id = "PI-2", File = "https://i/2.jpg", Enabled = true } },
                Traces = new List<PropertyTrace> ()
            },
            new()
            {
                Id = "P-003", Name = "Lote Sur", Address = "Km 3 vía Cali",
                Price = 800_000_000m, CodeInternal = "C-003", Year = 2020,
                Owner = new Owner { Id = "O-003", Name = "Marta", Address = "Cali", Photo = "https://p/3.jpg", Birthday = new DateTime(1992,7,7) },
                Images = new List<PropertyImage> { new() { Id = "PI-3", File = "https://i/3.jpg", Enabled = true } },
                Traces = new List<PropertyTrace> ()
            }
        };

        await col.InsertManyAsync(seed);
    }

    [Test]
    public async Task FindAsync_Should_Filter_By_Name_And_Price()
    {
        var filter = new PropertyFilter(
            Name: "Casa", Address: null,
            MinPrice: 400_000_000m, MaxPrice: 600_000_000m,
            Page: 1, PageSize: 10, Sort: "price:asc"
        );

        var result = await _repo.FindAsync(filter, default);

        Assert.That(result.Total, Is.EqualTo(1));
        Assert.That(result.Items, Has.Count.EqualTo(1));
        Assert.That(result.Items[0].Id, Is.EqualTo("P-001"));
        Assert.That(result.Items[0].Owner.Id, Is.EqualTo("O-001"));
        Assert.That(result.Items[0].Images[0].Id, Is.EqualTo("PI-1"));
    }

    [Test]
    public async Task GetByIdAsync_Should_Return_Entity_With_Subdocuments()
    {
        var p = await _repo.GetByIdAsync("P-003", default);

        Assert.That(p, Is.Not.Null);
        Assert.That(p!.Owner.Id, Is.EqualTo("O-003"));
        Assert.That(p.Images, Has.Count.EqualTo(1));
        Assert.That(p.Images[0].Id, Is.EqualTo("PI-3"));
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _runner?.Dispose();
    }
}
