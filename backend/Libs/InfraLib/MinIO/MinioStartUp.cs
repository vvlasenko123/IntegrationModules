using InfraLib.MinIO.Configuration;
using InfraLib.MinIO.Options;
using InfraLib.MinIO.Storage;
using InfraLib.Validation.Options;
using Microsoft.Extensions.DependencyInjection;

namespace InfraLib.Minio;

/// <summary>
/// Minio startup
/// </summary>
public static class MinioStartUp
{
    /// <summary>
    /// Minio extension
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