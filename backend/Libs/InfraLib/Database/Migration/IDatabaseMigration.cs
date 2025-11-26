namespace InfraLib.Database.Migration;

/// <summary>
/// Контракт миграций
/// </summary>
public interface IDatabaseMigration
{
    /// <summary>
    /// Применение миграций
    /// </summary>
    Task ApplyAsync(CancellationToken token);
}