using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;
using TaxFacileAPI.Aplication.Interfaces;
using TaxFacileAPI.Aplication.Mappings;
using TaxFacileAPI.Aplication.Services;
using TaxFacileAPI.Domain.Interfaces;
using TaxFacileAPI.InfraData.Context;
using TaxFacileAPI.InfraData.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
IConfiguration config = builder.Configuration;

//builder.Services.AddSingleton<IMongoClient>(sp =>
//{
//    return new MongoClient(config.GetConnectionString("ConnectionString"));
//});

//builder.Services.AddScoped(sp =>
//{
//    var client = sp.GetRequiredService<IMongoClient>();
//    //return client.GetDatabase(config.GetSection("ConnectionString").GetSection("DatabaseName").Value);
//    return client.GetDatabase("TaxFacile");
//});

builder.Services.Configure<NfeXmlDatabaseSetting>(
    builder.Configuration.GetSection("ConnectionStrings"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = config["jwt:issuer"],
        ValidAudience = config["jwt:audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["jwt:secretkey"])),
        ClockSkew = TimeSpan.Zero
    };
});


builder.Services.AddSingleton<NfeXmlRepository>();
builder.Services.AddTransient<INfeXmlService, NfeXmlService>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API Tax Easy",
        Description = "NFe",
        TermsOfService = new Uri("http://insidetechsolucoes.com.br/")
    });
});

//.WithHeaders(HeaderNames.ContentType, HeaderNames.Server, HeaderNames.AccessControlAllowHeaders, HeaderNames.AccessControlExposeHeaders, "x-custom-header", "x-path", "x-record-in-use", HeaderNames.ContentDisposition))

//https://learn.microsoft.com/pt-br/aspnet/core/security/cors?view=aspnetcore-6.0
builder.Services.AddCors(policyBuilder =>
    policyBuilder.AddDefaultPolicy(policy =>
        policy.WithOrigins("*")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .AllowAnyHeader())
);

builder.Services.AddTransient<IXmlNfeRepository, NfeXmlRepository>();
builder.Services.AddTransient<INfeXmlService, NfeXmlService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Tax Facile v1"));
}

app.UseCors();

app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
