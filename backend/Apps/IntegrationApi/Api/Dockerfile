FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src

COPY ["backend/Apps/IntegrationApi/Api/Api.csproj", "backend/Apps/IntegrationApi/Api/"]
COPY ["backend/Apps/IntegrationApi/Logic/Logic.csproj", "backend/Apps/IntegrationApi/Logic/"]
COPY ["backend/Apps/IntegrationApi/Dal/Dal.csproj", "backend/Apps/IntegrationApi/Dal/"]
COPY ["backend/Libs/InfraLib/InfraLib.csproj", "backend/Libs/InfraLib/"]

RUN dotnet restore "backend/Apps/IntegrationApi/Api/Api.csproj"
COPY . .

WORKDIR "/src/backend/Apps/IntegrationApi/Api"

RUN dotnet publish "Api.csproj" \
    -c Release \
    -o /app/publish \
    --self-contained false

FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS final
WORKDIR /app

RUN apk add --no-cache icu-libs icu-data-full

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]