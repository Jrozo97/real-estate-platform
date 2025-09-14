# ========================
# 1. Build stage
# ========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

# Restaurar dependencias
RUN dotnet restore

# Compilar y publicar
RUN dotnet publish -c Release -o /app/publish

# ========================
# 2. Runtime stage
# ========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Render expone el puerto 8080 por defecto
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "RealEstate.WebApi.dll"]