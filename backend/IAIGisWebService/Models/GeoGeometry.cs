using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace IAIGisWebService.Models
{
    //*** A DB geometry - Type & Coordinate
    public class GeoGeometry
    {
        // "Point" | "Polygon" - Can be expannd to line and multi...
        [BsonElement("type")]
        public string Type { get; set; } = null!;
        // Point    -> [lng, lat]
        // Polygon  -> [[[lng, lat], ...]]
        [BsonElement("coordinates")]
        public BsonValue Coordinates { get; set; } = null!;
    }
}
