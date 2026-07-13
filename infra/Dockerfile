# 1. Build Frontend
FROM node:20 AS build-frontend
WORKDIR /app
# Cria um arquivo index.html simples para o nginx e a build passar
RUN mkdir -p dist && echo "<html><body>Gestor App Backend Online</body></html>" > dist/index.html

# 2. Build .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-dotnet
WORKDIR /app
COPY backend/*.csproj ./
RUN dotnet restore
COPY backend/ ./
RUN dotnet publish -c Release -o /out

# 3. Runtime Final (Baseado no ASP.NET, que já tem o runtime do .NET)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# 4. Instala Node.js para rodar o 'serve'
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g serve && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 5. Copia os artefatos do build
COPY --from=build-dotnet /out .
COPY --from=build-frontend /app/dist ./dist-frontend

# 6. Expondo as portas: 8300 para o frontend, 8092 para o backend
EXPOSE 8300
EXPOSE 8092

# 7. Comando de inicialização
CMD ["sh", "-c", "serve -s ./dist-frontend -p 8300 & dotnet backend.dll --urls 'http://0.0.0.0:8092'"]
