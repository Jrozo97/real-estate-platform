using NUnit.Framework;
using RealEstate.Domain.Entities;

namespace RealEstate.Tests.Entities
{
    public class PropertyImageTests
    {
        [Test]
        public void PropertyImage_Should_Set_Properties_Correctly()
        {
            // Arrange
            var image = new PropertyImage
            {
                Id = "PI-001",
                File = "https://picsum.photos/seed/p001/800/600",
                Enabled = true
            };

            // Assert
            Assert.That(image.Id, Is.EqualTo("PI-001"));
            Assert.That(image.File, Is.EqualTo("https://picsum.photos/seed/p001/800/600"));
            Assert.That(image.Enabled, Is.True);
        }
    }
}
