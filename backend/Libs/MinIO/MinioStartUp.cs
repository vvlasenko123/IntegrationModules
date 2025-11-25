using InfraLib.MinIO.Options;
using InfraLib.Validation.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Minio;

namespace InfraLib.Minio;

/// <summary>
/// minio startup
/// </summary>
public static class MinioStartUp
{
    /// <summary>
    /// Миньо extension
    /// </summary>
    public static IServiceCollection AddMinioStorage(this IServiceCollection services)
    {
        services.AddOptions<MinioOptions>()
            .BindConfiguration(configSectionPath: nameof(MinioOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        services.AddSingleton<IMinioClient>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<MinioOptions>>().Value;

            var client = new MinioClient()
                .WithEndpoint(options.Endpoint)
                .WithCredentials(options.AccessKey, options.SecretKey);

            if (options.UseSsl)
            {
                client = client.WithSSL();
            }

            return client.Build();
        });

        // TODO подключить стикеры и эмодзи в DI
        //services.AddSingleton<IStickerImage, MinioImageStorage>();

        return services;
    }
}