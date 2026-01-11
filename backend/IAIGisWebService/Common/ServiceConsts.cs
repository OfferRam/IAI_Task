namespace IAIGisWebService.Common
{
    //Thread safe singlton for all apps constants
    public sealed class ServiceConsts
    {
        public const string API_ROUTE = "api/geo";
        public const string GEO_COLLECTION_NAME = "geoObjects";
        public const string GEO_INDEX_NAME = "Geometry";
        public const string POINT_NAME = "Point";
        public const string POLYGON_NAME = "Polygon";
        public const string MONGO_DB_SECTION = "MongoDbSettings";
    }
}
