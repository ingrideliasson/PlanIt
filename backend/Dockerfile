# -----------------------------
# Stage 1: Build
# -----------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy all backend files
COPY . .

# Restore NuGet packages
RUN dotnet restore "./backend.csproj"

# Publish the app (release mode)
RUN dotnet publish "./backend.csproj" -c Release -o /app/publish

# -----------------------------
# Stage 2: Runtime
# -----------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Environment variables for running in container
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_USE_POLLING_FILE_WATCHER=true

# Expose port 8080 (Render expects this)
EXPOSE 8080

# Entry point to run your app
ENTRYPOINT ["dotnet", "backend.dll"]
