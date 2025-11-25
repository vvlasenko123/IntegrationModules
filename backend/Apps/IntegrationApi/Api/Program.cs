using Api;
using InfraLib.HostConfiguration;

public class Program
{
    public static void Main(string[] args)
    {
        HostFactory.CreateHostBuilder<Startup>(args).Build().Run();
    }
}