using Microsoft.Extensions.DependencyInjection;

namespace Dal;

public static class DalStartUp
{
    /// <summary>
    /// Подключение Dal
    /// </summary>
    public static IServiceCollection AddDal(this IServiceCollection services)
    {
        return services;
    }
}
