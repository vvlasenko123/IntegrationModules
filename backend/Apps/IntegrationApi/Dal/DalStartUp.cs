using Dal.Migrations;
using Dal.Repository;
using Dal.Repository.interfaces;
using InfraLib.Database.Migration;
using Microsoft.Extensions.DependencyInjection;

namespace Dal;

public static class DalStartUp
{
    /// <summary>
    /// Подключение Dal
    /// </summary>
    public static IServiceCollection AddDal(this IServiceCollection services)
    {
        services.AddTransient<IDatabaseMigration, StickersCreateTablesMigration>();
        services.AddTransient<IDatabaseMigration, StickersAndNotesAddSizeMigration>();
        services.AddTransient<IStickerRepository, StickerRepository>();
        services.AddTransient<INoteRepository, NoteRepository>();

        return services;
    }
}
