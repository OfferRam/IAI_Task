namespace IAIGisWebService.Models
{
    //*** Geo Object DTO from client
    public class GeoObjectDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public GeoGeometryDto Geometry { get; set; } = null!;
    }
}
