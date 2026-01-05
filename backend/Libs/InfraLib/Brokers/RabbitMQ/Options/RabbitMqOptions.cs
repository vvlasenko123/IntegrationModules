using Microsoft.Extensions.Options;

namespace InfraLib.Brokers.RabbitMQ.Options;

/// <summary>
/// Настройки подключения и работы с RabbitMQ
/// </summary>
public class RabbitMqOptions : IValidateOptions<RabbitMqOptions>
{
    /// <summary>
    /// Имя хоста
    /// </summary>
    public string HostName { get; init; } = string.Empty;

    /// <summary>
    /// Порт
    /// </summary>
    public string Port { get; init; } = string.Empty;

    /// <summary>
    /// Адрес хоста RabbitMQ
    /// </summary>
    public string Host { get; init; } = string.Empty;

    /// <summary>
    /// Имя пользователя
    /// </summary>
    public string UserName { get; init; } = string.Empty;

    /// <summary>
    /// Пароль пользователя
    /// </summary>
    public string Password { get; init; } = string.Empty;

    /// <summary>
    /// Признак использования SSL для подключения
    /// </summary>
    public bool UseSsl { get; init; }

    /// <summary>
    /// Имя, которое клиент передает брокеру при подключении
    /// </summary>
    public string? ClientProvidedName { get; init; }

    /// <summary>
    /// Интервал heartbeat в секундах
    /// </summary>
    public int? RequestedHeartbeatSeconds { get; init; }

    /// <summary>
    /// Интервал восстановления соединения в секундах
    /// </summary>
    public int? NetworkRecoveryIntervalSeconds { get; init; }

    /// <summary>
    /// Имя exchange, в который публикуются сообщения
    /// </summary>
    public string? ExchangeName { get; init; }

    /// <summary>
    /// Тип exchange
    /// </summary>
    public string? ExchangeType { get; init; }

    /// <summary>
    /// Признак долговечности exchange
    /// </summary>
    public bool? DurableExchange { get; init; }

    /// <summary>
    /// Признак автоматического удаления exchange
    /// </summary>
    public bool? AutoDeleteExchange { get; init; }

    /// <summary>
    /// Имя очереди, из которой читаются сообщения
    /// </summary>
    public string? QueueName { get; init; }

    /// <summary>
    /// Признак долговечности очереди
    /// </summary>
    public bool? DurableQueue { get; init; }

    /// <summary>
    /// Признак автоматического удаления очереди
    /// </summary>
    public bool? AutoDeleteQueue { get; init; }

    /// <summary>
    /// Количество сообщений, которое брокер может отправить потребителю без подтверждения (QoS Prefetch)
    /// </summary>
    public int? PrefetchCount { get; init; }

    /// <summary>
    /// Количество параллельных обработчиков сообщений у потребителя
    /// </summary>
    public int? ConsumerConcurrency { get; init; }

    /// <summary>
    /// Имя dead-letter exchange, куда попадают сообщения, которые не удалось обработать
    /// </summary>
    public string? DeadLetterExchangeName { get; init; }

    /// <summary>
    /// Имя dead-letter очереди, куда попадают сообщения, которые не удалось обработать
    /// </summary>
    public string? DeadLetterQueueName { get; init; }

    /// <inheritdoc />
    public ValidateOptionsResult Validate(string? name, RabbitMqOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.Host)
            || string.IsNullOrWhiteSpace(options.HostName)
            || string.IsNullOrWhiteSpace(options.Password)
            || string.IsNullOrWhiteSpace(options.Port)
            || string.IsNullOrWhiteSpace(options.UserName))
        {
            return ValidateOptionsResult.Fail("Не заполнены обязательные поля подключения к RabbitMQ (Host, HostName, Port, UserName, Password)");
        }

        return ValidateOptionsResult.Success;
    }
}
