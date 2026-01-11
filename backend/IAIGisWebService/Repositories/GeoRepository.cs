using IAIGisWebService.Common;
using IAIGisWebService.Models;
using IAIGisWebService.MongoDB;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Diagnostics;

namespace IAIGisWebService.Repositories
{
    //REST API controller - Expose basic functionality
    public class GeoRepository : IGeoRepository
    {
        private readonly IMongoCollection<GeoObject> _collection;

        public GeoRepository(IOptions<MongoDbSettings> settings)
        {
            if (settings == null)
                throw new ArgumentNullException(nameof(settings));

            if (settings?.Value == null)
                throw new ArgumentNullException(nameof(settings.Value));

            try
            {
                //establish connection
                var client = new MongoClient(settings.Value.ConnectionString);
                var database = client.GetDatabase(settings.Value.DatabaseName);
                //Get collection
                _collection = database.GetCollection<GeoObject>(settings.Value.GeoCollectionName);
                //Create a geospatial index so MongoDB can efficiently run location-based queries, such as “Find places near me” and more...
                CreateGeoIndex();
            }
            catch(Exception ex)
            {
                Trace.WriteLine($"{typeof(GeoRepository)} Failed to construct GeoRepository. EX: {ex.Message}");
            }
        }

        private void CreateGeoIndex()
        {
            var indexKeys = Builders<GeoObject>.IndexKeys.Geo2DSphere(ServiceConsts.GEO_INDEX_NAME);
            _collection.Indexes.CreateOne(new CreateIndexModel<GeoObject>(indexKeys));
        }

        public async Task<List<GeoObject>> GetAllAsync() =>
            await _collection.Find(_ => true).ToListAsync();

        public async Task<GeoObject?> GetByIdAsync(string id) =>
            await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(List<GeoObject> geoObjects) =>
            await _collection.InsertManyAsync(geoObjects);

        public async Task DeleteAsync(string id) =>
            await _collection.DeleteOneAsync(x => x.Id == id);
    }
}
