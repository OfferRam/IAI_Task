using IAIGisWebService.Models;

namespace IAIGisWebService.Services
{
    public interface IGeoService
    {
        Task<List<GeoObject>> GetAllAsync();
        Task<GeoObject?> GetByIdAsync(string id);
        Task<List<GeoObject>> CreateAsync(List<GeoObject> geoObject);
        Task DeleteAsync(string id);
    }
}
