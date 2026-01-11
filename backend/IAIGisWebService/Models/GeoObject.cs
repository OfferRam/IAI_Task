
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace IAIGisWebService.Models
{
    //*** A DB geometry object - Add Id and Name to Geomtry - can be expanded to containg more props
    public class GeoObject
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;

        public GeoGeometry Geometry { get; set; } = null!;
    }
}
