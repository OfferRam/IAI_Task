using IAIGisWebService.Common;
using IAIGisWebService.Models;
using IAIGisWebService.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using SharpCompress.Common;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace IAIGisWebService.Controllers
{
    [ApiController]
    [Route(ServiceConsts.API_ROUTE)]
    public class GeoController : ControllerBase
    {
        //GeoController service
        private readonly IGeoService _service;
        //Inject outside service
        public GeoController(IGeoService service)
        {
            _service = service;
        }

        //*** REST api ***

        //Get all objects
        [HttpGet]
        public async Task<ActionResult<List<GeoObjectDto>>> GetAll()
        {
            var list = await _service.GetAllAsync();
            if (list == null)
            {
                Trace.WriteLine($"{typeof(GeoController)} Failed to GetAll().");
                return NotFound();
            }

            return Ok(list.Select(EntityConverter.MapToDto));
        }
        //Get single object by id
        [HttpGet("{id}")]
        public async Task<ActionResult<GeoObjectDto>> GetById(string id)
        {
            var geo = await _service.GetByIdAsync(id);
            if (geo is null)
            {
                Trace.WriteLine($"{typeof(GeoController)} Failed to GetById().");
                return NotFound();
            }

            return Ok(EntityConverter.MapToDto(geo));
        }
        //Add List<GeoObjectDto> to DB
        [HttpPost("batch")]
        public async Task<ActionResult<List<GeoObjectDto>>> Create([FromBody] List<GeoObjectDto> geoObjectDtos)
        {
            try
            {
                //Over come type script [[[...]]] -> [...] issue Mongo DB refuse to accept geo point if the format of [[[..]]]
                foreach (GeoObjectDto geo in geoObjectDtos)
                {
                    if (geo.Geometry.Type == ServiceConsts.POINT_NAME)
                    {
                        string coords = geo.Geometry.Coordinates.ToString();
                        coords = coords.Replace("[[[", "[").Replace("]]]", "]");
                        geo.Geometry.Coordinates = JsonSerializer.Deserialize<JsonElement>(coords); ;
                    }
                }
                //Convert to Dto's
                var entities = EntityConverter.GeoObjectDotToGeoObject(geoObjectDtos);
                var createdEntities = await _service.CreateAsync(entities);
                if(createdEntities == null)
                {
                    Trace.WriteLine($"{typeof(GeoController)} Failed to Create().");
                    return UnprocessableEntity();
                }
                var result = createdEntities.Select(EntityConverter.MapToDto).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                Trace.WriteLine($"{typeof(GeoController)} Failed to Create() Ex: {ex}.");
                return UnprocessableEntity();
            } 
        }
        //Delete GeoObject by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch(Exception ex)
            {
                Trace.WriteLine($"{typeof(GeoController)} Failed to Create() Ex: {ex}.");
                return UnprocessableEntity();
            }
        }
    }
}
