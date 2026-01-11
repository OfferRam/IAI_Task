using MongoDB.Driver;

namespace IAIGisWebService.MongoDB
{
    public class MongoDbService
    {
        public IMongoDatabase Database { get; }

        public MongoDbService(IConfiguration config)
        {
            var client = new MongoClient(
                config["MongoDbSettings:ConnectionString"]);

            Database = client.GetDatabase(
                config["MongoDbSettings:DatabaseName"]);
        }
    }
}
