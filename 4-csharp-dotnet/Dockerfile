# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy project file and restore dependencies
COPY dotnet-demo.csproj .
RUN dotnet restore

# Copy source code and build
COPY Program.cs .
RUN dotnet publish -c Release -o out

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/runtime:8.0

WORKDIR /app

# Copy the build output from build stage
COPY --from=build /app/out .

# Run the application
ENTRYPOINT ["dotnet", "dotnet-demo.dll"]
