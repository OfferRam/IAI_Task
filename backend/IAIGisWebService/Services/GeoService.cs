using IAIGisWebService.Common;
using IAIGisWebService.Models;
using IAIGisWebService.Repositories;

namespace IAIGisWebService.Services
{
    public class GeoService : IGeoService
    {
        private readonly IGeoRepository _repository;

        public GeoService(IGeoRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<List<GeoObject>> GetAllAsync() =>
            await _repository.GetAllAsync();

        public async Task<GeoObject?> GetByIdAsync(string id) =>
            await _repository.GetByIdAsync(id);

        public async Task<List<GeoObject>> CreateAsync(List<GeoObject> geoObjects)
        {
            if(geoObjects == null || !geoObjects.Any())
                throw new ArgumentException("Invalid list");

            //Can also check if each geo object is not (ServiceConsts.POINT_NAME or ServiceConsts.POLYGON_NAME))
            //That can be done when expnding to other geo types as line etc.

            await _repository.CreateAsync(geoObjects);
            return geoObjects;
        }

        public async Task DeleteAsync(string id) =>
            await _repository.DeleteAsync(id);
    }
}
