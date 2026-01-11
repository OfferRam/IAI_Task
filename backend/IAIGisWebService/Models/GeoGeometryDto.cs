using System.Text.Json;

namespace IAIGisWebService.Models
{
    //*** Geomtry DTO from client
    public class GeoGeometryDto
    {
        // "Point" | "Polygon" - Can be expannd to line and multi...
        public string Type { get; set; } = null!;
        // Raw GeoJSON (array)
        public JsonElement Coordinates { get; set; }
    }
}
