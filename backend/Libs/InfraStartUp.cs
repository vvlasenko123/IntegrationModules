using InfraLib.Database;
using InfraLib.Minio;
using InfraLib.Redis;
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
        services.AddMinioStorage();
        services.AddPostgres();
        services.AddRedis();
        return services;
    }
}