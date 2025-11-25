using Microsoft.Extensions.DependencyInjection;

namespace Logic;

public static class LogicStartUp
{
    /// <summary>
    /// Добавление логики пользователей
    /// </summary>
    public static IServiceCollection AddLogic(this IServiceCollection services)
    {
        return services;
    }
}
