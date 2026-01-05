using InfraLib.MinIO.Options;
using Microsoft.Extensions.Options;
using Minio;

namespace InfraLib.MinIO.Configuration;

/// <summary>
/// Minio конфигуратор
/// </summary>
public sealed class MinioClientConfigurator
{
    /// <summary>
    /// Minio клиент
    /// </summary>
    public IMinioClient Client { get; }

    /// <summary>
    /// Конструктор
    /// </summary>
    public MinioClientConfigurator(IOptions<MinioOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);

        var value = options.Value;

        var client = new MinioClient()
            .WithEndpoint(value.Endpoint)
            .WithCredentials(value.AccessKey, value.SecretKey);

        if (value.UseSsl)
        {
            client = client.WithSSL();
        }

        Client = client.Build();
    }
}
