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
        #region Миграции отката
        /*
           services.AddTransient<IDatabaseMigration, ShapesDropTablesRollbackMigration>();
           services.AddTransient<IDatabaseMigration, ShapesCreateTablesRollbackMigration>();
           services.AddTransient<IDatabaseMigration, StickersAndNotesAddSizeRollbackMigration>();
           services.AddTransient<IDatabaseMigration, StickersCreateTablesRollbackMigration>();
         */
        #endregion

        #region Миграции применения
        services.AddTransient<IDatabaseMigration, StickersCreateTablesMigration>();
        services.AddTransient<IDatabaseMigration, StickersAndNotesAddSizeMigration>();
        services.AddTransient<IDatabaseMigration, ShapesCreateTablesMigration>();
        services.AddTransient<IDatabaseMigration, ShapesSeedMigration>();
        #endregion
        
        services.AddTransient<IStickerRepository, StickerRepository>();
        services.AddTransient<INoteRepository, NoteRepository>();
        services.AddTransient<IShapeRepository, ShapeRepository>();

        return services;
    }
}
