using InfraLib.MinIO.Configuration;
using InfraLib.MinIO.Options;
using InfraLib.MinIO.Storage;
using InfraLib.Validation.Options;
using Microsoft.Extensions.DependencyInjection;

namespace InfraLib.Minio;

/// <summary>
/// minio startup
/// </summary>
public static class MinioStartUp
{
    /// <summary>
    /// Миньо extension
    /// </summary>
    public static void AddMinioStorage(this IServiceCollection services)
    {
        services.AddOptions<MinioOptions>()
            .BindConfiguration(configSectionPath: nameof(MinioOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        services.AddSingleton<MinioClientConfigurator>();
        services.AddSingleton<MinioImageStorage>();
    }
}