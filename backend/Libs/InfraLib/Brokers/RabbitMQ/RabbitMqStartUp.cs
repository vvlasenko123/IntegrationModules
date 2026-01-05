using InfraLib.Brokers.RabbitMQ.Options;
using InfraLib.Validation.Options;
using Microsoft.Extensions.DependencyInjection;

namespace InfraLib.Brokers.RabbitMQ;

public static class RabbitMqStartUp
{
    public static IServiceCollection AddRabbitMQ(this IServiceCollection services)
    {
        services.AddOptions<RabbitMqOptions>()
            .BindConfiguration(configSectionPath: nameof(RabbitMqOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        return services;
    }
}