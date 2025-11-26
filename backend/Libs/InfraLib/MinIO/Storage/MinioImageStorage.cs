using InfraLib.MinIO.Options;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace InfraLib.MinIO.Storage;

/// <summary>
/// миньо чтобы хранить изображение
/// </summary>
public sealed class MinioImageStorage
{
    /// <summary>
    /// миньо клиент
    /// </summary>
    private readonly IMinioClient _client;
    
    /// <summary>
    /// миньо опции
    /// </summary>
    private readonly MinioOptions _options;

    public MinioImageStorage(
        IMinioClient client,
        IOptions<MinioOptions> options)
    {
        _client = client;
        _options = options.Value;
    }

    /// <summary>
    /// Загрузка файлов
    /// </summary>
    public async Task<string> UploadAsync(Guid objectId, Stream content, string contentType, CancellationToken cancellationToken)
    {
        await EnsureBucketExistsAsync(cancellationToken);

        var objectName = $"stickers/{objectId:D}/{Guid.NewGuid():N}";

        var args = new PutObjectArgs()
            .WithBucket(_options.BucketName)
            .WithObject(objectName)
            .WithStreamData(content)
            .WithObjectSize(content.Length)
            .WithContentType(contentType);

        await _client.PutObjectAsync(args, cancellationToken);

        return objectName;
    }

    /// <summary>
    /// Получение ссылки на скачивание файла.
    /// </summary>
    public async Task<string> GetDownloadUrlAsync(string objectName, int expirySeconds, CancellationToken cancellationToken)
    {
        await EnsureBucketExistsAsync(cancellationToken);

        var args = new PresignedGetObjectArgs()
            .WithBucket(_options.BucketName)
            .WithObject(objectName)
            .WithExpiry(expirySeconds);

        return await _client.PresignedGetObjectAsync(args);
    }

    /// <summary>
    /// Создание бакета, если его нет
    /// </summary>
    private async Task EnsureBucketExistsAsync(CancellationToken cancellationToken)
    {
        var bucketExistsArgs = new BucketExistsArgs()
            .WithBucket(_options.BucketName);

        var exists = await _client.BucketExistsAsync(bucketExistsArgs, cancellationToken);

        if (exists)
        {
            return;
        }

        var makeBucketArgs = new MakeBucketArgs()
            .WithBucket(_options.BucketName);

        await _client.MakeBucketAsync(makeBucketArgs, cancellationToken);
    }
}