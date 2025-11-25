using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace InfraLib.Swagger;

/// <summary>
/// Подключение Swagger
/// </summary>
public static class SwaggerStartUp
{
    /// <summary>
    /// Регистрация Swagger в DI
    /// </summary>
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();

        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Integration API",
                Version = "v1"
            });
        });

        return services;
    }

    /// <summary>
    /// Подключение middleware Swagger
    /// </summary>
    public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Integration API v1");
        });

        return app;
    }
}