using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Mongo;

public static class MongoSetup
{
    private static bool _done;

    public static void Register()
    {
        if (_done) return;

        // 1) Conventions globales
        var pack = new ConventionPack
        {
            new CamelCaseElementNameConvention(),
            new IgnoreExtraElementsConvention(true)
        };
        ConventionRegistry.Register("realestate_conventions", pack, _ => true);

        // 2) ClassMaps explícitos (opcional pero útil)
        if (!BsonClassMap.IsClassMapRegistered(typeof(Property)))
        {
            BsonClassMap.RegisterClassMap<Property>(cm =>
            {
                cm.AutoMap();
                cm.SetIgnoreExtraElements(true);
                cm.MapMember(c => c.Id).SetElementName("id");
                cm.MapMember(c => c.Name).SetElementName("name");
                cm.MapMember(c => c.Address).SetElementName("address");
                cm.MapMember(c => c.Price).SetElementName("price");
                cm.MapMember(c => c.CodeInternal).SetElementName("codeInternal");
                cm.MapMember(c => c.Year).SetElementName("year");
                cm.MapMember(c => c.Owner).SetElementName("owner");
                cm.MapMember(c => c.Images).SetElementName("images");
                cm.MapMember(c => c.Traces).SetElementName("traces");
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(Owner)))
        {
            BsonClassMap.RegisterClassMap<Owner>(cm =>
            {
                cm.AutoMap();
                cm.SetIgnoreExtraElements(true);
                cm.MapMember(c => c.Id).SetElementName("id");
                cm.MapMember(c => c.Name).SetElementName("name");
                cm.MapMember(c => c.Address).SetElementName("address");
                cm.MapMember(c => c.Photo).SetElementName("photo");
                cm.MapMember(c => c.Birthday).SetElementName("birthday");
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(PropertyImage)))
        {
            BsonClassMap.RegisterClassMap<PropertyImage>(cm =>
            {
                cm.AutoMap();
                cm.SetIgnoreExtraElements(true);
                cm.MapMember(c => c.Id).SetElementName("id");
                cm.MapMember(c => c.File).SetElementName("file");
                cm.MapMember(c => c.Enabled).SetElementName("enabled");
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(PropertyTrace)))
        {
            BsonClassMap.RegisterClassMap<PropertyTrace>(cm =>
            {
                cm.AutoMap();
                cm.SetIgnoreExtraElements(true);
                cm.MapMember(c => c.Id).SetElementName("id");
                cm.MapMember(c => c.DateSale).SetElementName("dateSale");
                cm.MapMember(c => c.Name).SetElementName("name");
                cm.MapMember(c => c.Value).SetElementName("value");
                cm.MapMember(c => c.Tax).SetElementName("tax");
            });
        }

        _done = true;
    }
}
