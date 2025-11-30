using Microsoft.Extensions.DependencyInjection;

namespace Logic;

public static class LogicStartUp
{
    /// <summary>
    /// Добавление сервисов
    /// </summary>
    public static IServiceCollection AddLogic(this IServiceCollection services)
    {
        return services;
    }
}
