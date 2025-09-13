using NUnit.Framework;
using RealEstate.Domain.Entities;
using System;

namespace RealEstate.Tests.Entities
{
    public class PropertyTraceTests
    {
        [Test]
        public void PropertyTrace_Should_Set_Properties_Correctly()
        {
            // Arrange
            var trace = new PropertyTrace
            {
                Id = "T-001",
                DateSale = new DateTime(2022, 1, 15),
                Name = "Venta inicial",
                Value = 450000000m,
                Tax = 0.05m
            };

            // Assert
            Assert.That(trace.Id, Is.EqualTo("T-001"));
            Assert.That(trace.DateSale, Is.EqualTo(new DateTime(2022, 1, 15)));
            Assert.That(trace.Name, Is.EqualTo("Venta inicial"));
            Assert.That(trace.Value, Is.EqualTo(450000000m));
            Assert.That(trace.Tax, Is.EqualTo(0.05m));
        }
    }
}
