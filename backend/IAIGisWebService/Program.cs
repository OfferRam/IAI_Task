using IAIGisWebService.Common;
using IAIGisWebService.MongoDB;
using IAIGisWebService.Repositories;
using IAIGisWebService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection(ServiceConsts.MONGO_DB_SECTION));
builder.Services.AddSingleton<IGeoRepository, GeoRepository>();
builder.Services.AddScoped<IGeoService, GeoService>();

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
// Learn more about configuring Swagger/OpenAPI at aka.ms
builder.Services.AddEndpointsApiExplorer();

//*** Support Swagger compability
builder.Services.AddSwaggerGen();
//*** IMPORTANT - Add CORS policy - Not to restrict react client - "AllowReactApp"
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:3000") // React app URL
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowReactApp");


////************* This is an endpoints For DEBUG - Should not have 2 endpoints *************
//app.MapPost("/api/geo", ([FromBody] GeoObjectDto geo) =>
//{
//    Console.WriteLine($"Received geo object: {geo.Name}");
//    Console.WriteLine($"Geometry type: {geo.Geometry.Type}");
//    Console.WriteLine($"Geometry type: {geo.Geometry.Coordinates}");
//    return Results.Ok(new { success = true });
//});
//******************************************************************************************

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
