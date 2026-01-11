using IAIGisWebService.Models;

namespace IAIGisWebService.Repositories
{
    //Slim API interface
    public interface IGeoRepository
    {
        Task<List<GeoObject>> GetAllAsync();
        Task<GeoObject?> GetByIdAsync(string id);
        Task CreateAsync(List<GeoObject> geoObjects);
        Task DeleteAsync(string id);
    }
}
