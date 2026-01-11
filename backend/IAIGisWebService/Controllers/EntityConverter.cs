using IAIGisWebService.Models;
using IAIGisWebService.Repositories;
using MongoDB.Bson;
using System.Diagnostics;
using System.Text.Json;

namespace IAIGisWebService.Controllers
{
    public class EntityConverter
    {
        //Convert a single GeoObject to GeoObjectDto before returning to client
        public static GeoObjectDto MapToDto(GeoObject geo)
        {
            try
            {
                return new GeoObjectDto
                {
                    Id = geo.Id,
                    Name = geo.Name,
                    Geometry = new GeoGeometryDto
                    {
                        Type = geo.Geometry.Type,
                        Coordinates = ToJson(geo.Geometry.Coordinates)
                    }
                };
            }
            catch (Exception ex)
            {
                Trace.WriteLine($"{typeof(EntityConverter)} MapToDto() Failed. EX: {ex.Message}");
                return new GeoObjectDto();
            }
        }
        //Recursive Convert to JsonElement - Used for nested coordinates
        public static JsonElement ToJson(BsonValue bson)
        {
            try
            {
                var json = bson.ToJson();
                return JsonSerializer.Deserialize<JsonElement>(json);
            }
            catch(Exception ex)
            {
                Trace.WriteLine($"{typeof(EntityConverter)} ToJson() Failed. EX: {ex.Message}");
                return new JsonElement();
            }
        }
        //Convert a List of GeoObjectDto to List of GeoObject before sending to DB
        public static List<GeoObject> GeoObjectDotToGeoObject(List<GeoObjectDto> geoObjectDtos)
        {
            List<GeoObject> geoObjects = new List<GeoObject>();
            try
            {
                geoObjects = geoObjectDtos.Select(dto => new GeoObject
                {
                    Id = dto.Id,
                    Name = dto.Name,
                    Geometry = new GeoGeometry
                    {
                        Type = dto.Geometry.Type,
                        Coordinates = ToBson(dto.Geometry.Coordinates)
                    }
                }).ToList();
                return geoObjects;
            }
            catch (Exception ex)
            {
                Trace.WriteLine($"{typeof(EntityConverter)} ToJson() Failed. EX: {ex.Message}");
            }
            return geoObjects;
        }
        //Recursive Convert back to BsonValue
        public static BsonValue ToBson(JsonElement element)
        {
            try
            {
                return element.ValueKind switch
                {
                    JsonValueKind.Array => new BsonArray(
                        element.EnumerateArray().Select(ToBson)),
                    JsonValueKind.Number => new BsonDouble(element.GetDouble()),
                    JsonValueKind.String => new BsonString(element.GetString()),
                    JsonValueKind.True => BsonBoolean.True,
                    JsonValueKind.False => BsonBoolean.False,
                    JsonValueKind.Null => BsonNull.Value,
                    _ => throw new NotSupportedException()
                };
            }
            catch (Exception ex)
            {
                Trace.WriteLine($"{typeof(EntityConverter)} ToBson() Failed. EX: {ex.Message}");
                return null;
            }
        }
    }
}
