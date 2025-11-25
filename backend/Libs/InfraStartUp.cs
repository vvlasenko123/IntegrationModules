using InfraLib.Database;
using InfraLib.Minio;
using InfraLib.Swagger;
using Microsoft.Extensions.DependencyInjection;

namespace InfraLib;

/// <summary>
/// Инфраструктура
/// </summary>
public static class InfraStartUp
{
    /// <summary>
    /// Добавление инфраструктуры
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSwaggerDocumentation();
        services.AddMinioStorage();
        services.AddPostgres();
        return services;
    }
}