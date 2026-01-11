using IAIGisWebService.Common;

namespace IAIGisWebService.MongoDB
{
    //*** A class used for establishing connection with MongoDB Tier
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string GeoCollectionName  = ServiceConsts.GEO_COLLECTION_NAME;
    }
}
