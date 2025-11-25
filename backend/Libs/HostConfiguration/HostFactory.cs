using InfraLib.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace InfraLib.HostConfiguration;

/// <summary>
/// Фабрика хоста
/// </summary>
public static class HostFactory
{
    /// <summary>
    /// Создание хоста
    /// </summary>
    public static IHostBuilder CreateHostBuilder<TStartup>(string[] args) where TStartup : class
    {
        return Host.CreateDefaultBuilder(args)
            .UseInfraSerilog()
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<TStartup>();
            });
    }
}