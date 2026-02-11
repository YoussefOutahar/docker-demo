using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("=================================");
        Console.WriteLine("Hello from .NET!");
        Console.WriteLine("=================================");
        Console.WriteLine($"Framework: C# .NET");
        Console.WriteLine($"Version: {Environment.Version}");
        Console.WriteLine($"Timestamp: {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
        Console.WriteLine("=================================");
        Console.WriteLine("\nPress any key to exit...");
        Console.ReadKey();
    }
}
