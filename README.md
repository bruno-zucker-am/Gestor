# Gestor Financeiro

## Visão geral

O Gestor Financeiro é uma aplicação full-stack voltada para gestão operacional de clientes, fornecedores, revendedores e usuários administrativos. A solução foi estruturada com uma API REST em ASP.NET Core 8 no backend, um cliente mobile em React Native com Expo no frontend e um banco relacional SQL Server para persistência.

O projeto foi concebido para suportar cenários com múltiplos perfis de acesso, destacando-se o fluxo de autenticação para administradores e masters, além do controle de visibilidade por domínio de ownership, em que cada master acessa apenas os registros vinculados à sua conta.

## Arquitetura

### Backend
- API REST construída com ASP.NET Core 8
- Padrão de organização por camadas: controllers, services, DTOs e models
- ORM Entity Framework Core com SQL Server
- Migrações automáticas aplicadas na inicialização da aplicação
- Controle de isolamento de dados por master via header HTTP `X-Master-Id`

### Frontend
- Aplicação mobile desenvolvida com React Native e Expo Router
- Consumo de APIs via fetch nativo
- Armazenamento local de sessão em AsyncStorage
- Integração com o contexto do usuário autenticado para envio de cabeçalhos de autorização e scoping

### Infraestrutura
- Contêinerização com Docker
- Proxy reverso com Nginx
- Estrutura preparada para ambientes locais e de homologação

## Requisitos prévios

Para executar o projeto, são necessários:

- .NET SDK 8.x
- Node.js 20.x ou superior
- npm
- SQL Server acessível
- Docker e Docker Compose 
- Expo CLI
- Vps 6gb, 4Vcpu, linux, ubuntu 22

## Instalação das ferramentas

### 1. Instalar .NET SDK 8

No Ubuntu/Debian, por exemplo:

```bash
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O /tmp/packages-microsoft-prod.deb
sudo dpkg -i /tmp/packages-microsoft-prod.deb
sudo apt update
dotnet new webapi --framework net8.0 --force
```

Verifique a instalação:

```bash
dotnet --version
```

### 2. Instalar Node.js 20 e npm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verifique:

```bash
node --version
npm --version
```

### 3. Instalar Docker e Docker Compose

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

> Após esse passo, faça logout/login ou reinicie a sessão do shell.

### 4. Instalar ferramentas adicionais para imagens e build mobile

```bash
sudo apt-get update
sudo apt-get install -y imagemagick
```

### 5. Instalar EF Core CLI

```bash
dotnet tool install --global dotnet-ef
```

## Validação e build do backend

### 1. Restaurar dependências

```bash
cd /root/Gestor
 dotnet restore backend/backend.csproj
```

### 2. Build do backend

```bash
dotnet build backend/backend.csproj
```

### 3. Executar o backend

```bash
cd /root/Gestor
ASPNETCORE_URLS=http://0.0.0.0:8092 dotnet run --project backend/backend.csproj
```

## Validação e build do frontend

### 1. Instalar dependências do Expo

```bash
cd /root/Gestor/frontend
npm install
```

### 2. Verificar tipos do TypeScript

```bash
npx tsc --noEmit
```

### 3. Verificar compatibilidade do Expo

```bash
npx expo-doctor
```

### 4. Verificar alinhamento de dependências do Expo

```bash
npx expo install --check
```

### 5. Executar o frontend

```bash
cd /root/Gestor/frontend
npm start
```

### 6. Build e configuração do Expo Application Services (EAS)

```bash
cd /root/Gestor/frontend
npx eas build:configure
npx eas build --platform android --profile production
npx eas build --platform android --profile development
```

> Use o comando de produção para gerar artefatos de release e o comando de desenvolvimento para builds de validação e testes.

## Build do Docker

O build da imagem do projeto deve ser executado a partir da pasta [infra](infra):

```bash
cd /root/Gestor/infra
docker compose build
```

Ou, se preferir subir tudo imediatamente:

```bash
cd /root/Gestor/infra
docker compose up --build
```

## Estrutura do repositório

```text
backend/        # API ASP.NET Core 8
frontend/       # Aplicação Expo / React Native
infra/          # Configurações de container e proxy
sql/            # Scripts SQL auxiliares
imagem1.png
imagem2.png
imagem3.png
imagem4.png
imagem5.png
imagem6.png
imagem7.png
```

As imagens podem ser colocadas na raiz do projeto e referenciadas no README ou em documentação complementar com os caminhos abaixo:

```text
./imagem1.png
./imagem2.png
./imagem3.png
./imagem4.png
./imagem5.png
./imagem6.png
./imagem7.png
```

## Configuração do backend

### 1. Ajuste da connection string

A string de conexão é lida a partir de [backend/appsettings.json](backend/appsettings.json).

Exemplo de configuração:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=ProjetosDB;User Id=sa;Password=SuaSenhaForteAqui!;TrustServerCertificate=True;"
  }
}
```

Em ambientes Docker, o host do SQL Server precisa ser compatível com a rede do container. O valor padrão atual pode ser ajustado conforme a topologia do ambiente.

### 2. Execução local do backend

```bash
cd /root/Gestor
ASPNETCORE_URLS=http://0.0.0.0:8092 dotnet restore backend/backend.csproj
ASPNETCORE_URLS=http://0.0.0.0:8092 dotnet run --project backend/backend.csproj
```

A API ficará disponível em:

- http://localhost:8092

Os endpoints principais são:

- POST /api/login/login
- GET/POST/PATCH/DELETE /api/cliente
- GET/POST/PATCH/DELETE /api/fornecedor
- GET/POST/PATCH/DELETE /api/revendedor

### 3. Migrações do banco

O projeto utiliza EF Core e já conta com migrações em [backend/Migrations](backend/Migrations). Ao iniciar a aplicação, o código aplica automaticamente as migrações pendentes.

## Configuração do frontend

### 1. Variável de ambiente da API

A URL base da API é configurada em [frontend/.env](frontend/.env).

Exemplo local:

```env
EXPO_PUBLIC_API_URL=http://localhost:8092/api
```

Para execução em emulador Android, pode ser necessário usar:

```env
EXPO_PUBLIC_API_URL=https://dominio.shop:8092/api
```

### 2. Instalação das dependências

```bash
cd /root/Gestor/frontend
npm install
```

### 3. Execução local do frontend

```bash
cd /root/Gestor/frontend
npm start
```

Ou, alternativamente:

```bash
cd /root/Gestor/frontend
npx expo start --tunnel
```

## Execução com Docker

A infraestrutura necessária para execução em container está em [infra/compose.yml](infra/compose.yml) e [infra/Dockerfile](infra/Dockerfile).

Para subir a aplicação:

```bash
cd /root/Gestor/infra
docker compose build --no-cache && docker compose up -d
```

As portas expostas incluem:

- 8300: frontend
- 8092: backend

## Banco de dados e scripts SQL

Os scripts disponíveis em [sql](sql) servem como apoio para criação de tabelas, usuários iniciais e operações de manutenção. Para ambientes mais complexos, recomenda-se validar os scripts contra o schema real do banco antes de executar em produção.

### 1. Criar o banco de dados

```sql
CREATE DATABASE [ProjetosDB];
GO
```

### 2. Criar o schema utilizado pela aplicação

```sql
USE [ProjetosDB];
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'Gestor')
BEGIN
    EXEC('CREATE SCHEMA [Gestor]');
END
GO
```

### 3. Executar os scripts de estrutura

Os arquivos em [sql](sql) podem ser executados no SQL Server Management Studio ou via sqlcmd, por exemplo:

```bash
sqlcmd -S localhost,1433 -U sa -P 'uaSenhaForteAqui!' -i sql/"-- Cria tabela.sql"
```

### 4. Aplicar as migrações do EF Core

Se você preferir criar uma nova migração:

```bash
cd /root/Gestor/backend
dotnet ef migrations add InicialGestor
```

Se você quiser aplicar as migrações diretamente no banco, o comando abaixo funciona para o ambiente com container usando o connection string informado:

```bash
cd /root/Gestor/backend
dotnet ef database update --connection "Server=localhost,1433;Database=ProjetosDB;User Id=SA;Password=uaSenhaForteAqui!;TrustServerCertificate=True;"
```

> Se o comando `dotnet ef` não estiver disponível, execute primeiro:
>
> ```bash
> dotnet tool install --global dotnet-ef
> ```

### 5. Criar usuário administrador inicial

O script em [sql](sql) pode ser usado para criar um usuário inicial de acesso. Exemplo de intenção:

```sql
USE [ProjetosDB];
GO

-- Exemplo genérico de inserção de usuário administrador.
-- A senha deve ser gerada com hashing de senha do ASP.NET Core em ambiente real.
```

> Em ambiente real, a senha deve ser gerada com hashing de senha do ASP.NET Core, não armazenada em texto puro.

## Autenticação e controle de acesso

A autenticação é realizada no endpoint:

```http
POST /api/login/login
```

O payload esperado é:

```json
{
  "identificador": "usuario",
  "senha": "senha-do-usuario"
}
```

O backend autentica primeiro como administrador e, em seguida, como master.

## Isolamento por master

A aplicação implementa um modelo de isolamento de dados por master, em que cada master visualiza e manipula apenas os registros associados à sua conta.

Esse comportamento é aplicado via cabeçalho HTTP:

```http
X-Master-Id: <id-do-master>
```

O frontend tenta encaminhar esse cabeçalho automaticamente para as operações realizadas por usuários do tipo master.

### Exemplo de vinculação via SQL

Para associar registros a um master específico, pode-se usar uma operação semelhante a esta:

```sql
USE [ProjetosDB];

UPDATE [Gestor].[Cliente]
SET [MasterId] = 5
WHERE [MasterId] IS NULL;

UPDATE [Gestor].[Fornecedor]
SET [MasterId] = 5
WHERE [MasterId] IS NULL;

UPDATE [Gestor].[Revendedor]
SET [MasterId] = 5
WHERE [MasterId] IS NULL;
```

## Nginx, Cloudflare, Dockerfile e certificados SSL

### 1. Configuração exata do Nginx

A configuração real do Nginx está em [infra/nginx.conf](infra/nginx.conf) e contém os seguintes pontos:

- o servidor escuta na porta 80 e faz redirecionamento para HTTPS com:
  - `return 301 https://$host$request_uri;`
- o servidor HTTPS escuta na porta 443
- o domínio configurado é `seu-dominio.exemplo`
- o certificado SSL esperado é:
  - `/etc/nginx/ssl/seu-certificado.pem`
  - `/etc/nginx/ssl/seu-certificado.key`
- a rota `/` faz proxy para `http://Gestor:8300`
- a rota `/api/` faz proxy para `http://Gestor:8092`
- os headers proxy enviados são:
  - `Host`
  - `X-Real-IP`
  - `X-Forwarded-For`
  - `X-Forwarded-Proto`

Ou seja, o fluxo real é: cliente -> Nginx -> container `Gestor`.

### 2. Como o compose monta o Nginx

A configuração de containers está em [infra/compose.yml](infra/compose.yml) e o comportamento atual é este:

- o serviço `Gestor` expõe internamente as portas 8300 e 8092
- o serviço `nginx` expõe externamente:
  - `8093:80`
  - `2096:443`
- o volume abaixo é montado no container do Nginx:
  - `./nginx.conf:/etc/nginx/nginx.conf:ro`
  - `../cdn/ssl:/etc/nginx/ssl:ro`
  - `/dev/null:/etc/nginx/conf.d/default.conf:ro`

Isso significa que, na prática, o tráfego público chega no host nas portas 8093 e 2096 e é encaminhado para o container do Nginx.

### 3. Regras de origem e CORS

No código atual, a API ASP.NET Core usa uma política CORS aberta em [backend/Program.cs](backend/Program.cs), com `AllowAll`.

Portanto, no repositório atual:
- não existe uma regra de origem específica no Nginx para o domínio
- não existe uma lista restrita de origens no compose ou no nginx.conf
- a política de origem está no backend, não no proxy

Se for para produção, o ajuste correto seria substituir essa política por origens explícitas, por exemplo:
- `https://seu-dominio.exemplo`
- `https://seu-dominio.exemplo`

### 4. Cloudflare

Não existe configuração do Cloudflare no repositório. O que está definido no projeto é o domínio `seu-dominio.exemplo` no [infra/nginx.conf](infra/nginx.conf).

Em um ambiente com Cloudflare, a configuração esperada é:
- apontar o DNS do domínio para o servidor que executa o Docker Compose
- deixar o Nginx como ponto de entrada do tráfego HTTPS
- manter as portas 80 e 443 no proxy, conforme a configuração atual

### 5. Como o Dockerfile monta a imagem

A imagem é construída a partir de [infra/Dockerfile](infra/Dockerfile) com os seguintes passos:

1. etapa `build-frontend`
   - usa `node:20`
   - cria um `dist/index.html` simples

2. etapa `build-dotnet`
   - usa `mcr.microsoft.com/dotnet/sdk:8.0`
   - executa `dotnet restore`
   - executa `dotnet publish -c Release -o /out`

3. etapa `final`
   - usa `mcr.microsoft.com/dotnet/aspnet:8.0`
   - instala `nodejs`, `serve` e `curl`
   - copia os artefatos do backend e do frontend
   - expõe as portas 8300 e 8092
   - inicia a aplicação com:
     - `serve -s ./dist-frontend -p 8300`
     - `dotnet backend.dll --urls 'http://0.0.0.0:8092'`

### 6. Diretório CDN/SSL

O diretório [cdn](cdn) é usado para armazenar certificados e outros arquivos relacionados a TLS. O compose monta [cdn/ssl](cdn/ssl) no container do Nginx em:

- `/etc/nginx/ssl`

Os arquivos esperados pela configuração atual são:
- `/etc/nginx/ssl/seu-certificado.pem`
- `/etc/nginx/ssl/seu-certificado.key`

Ou seja, o fluxo exato é:
- os certificados ficam em [cdn/ssl](cdn/ssl)
- o compose monta esse diretório dentro do container Nginx
- o nginx.conf aponta o Nginx para esses arquivos

## Decisões técnicas e escolhas de arquitetura

### 1. Backend em ASP.NET Core 8
- A API foi implementada com ASP.NET Core 8 para aproveitar o modelo moderno de injeção de dependência, middleware e configuração centralizada.
- A estrutura segue um padrão simples de controllers, services, DTOs e models, adequado para manutenção incremental sem introduzir complexidade desnecessária.

### 2. Entity Framework Core com migrações
- O projeto usa EF Core para abstrair o acesso ao SQL Server e manter a evolução do schema controlada por migrações.
- A execução automática de `Database.Migrate()` no startup reduz o esforço operacional para ambientes locais e de homologação.

### 3. Isolamento por master
- A lógica de ownership foi implementada através do campo `MasterId` nas entidades e do header `X-Master-Id` nas requisições.
- Essa abordagem permite que o backend mantenha o controle de escopo sem depender exclusivamente da camada de UI.

### 4. Frontend mobile com Expo Router
- O frontend foi montado com Expo + React Native para acelerar o ciclo de desenvolvimento de uma aplicação mobile com uma base moderna.
- O uso de `fetch` nativo e `AsyncStorage` mantém a solução leve, sem depender de bibliotecas adicionais para fluxo básico de autenticação e chamadas de API.

### 5. Infraestrutura com Docker e Nginx
- O projeto utiliza Docker Compose para orquestrar a aplicação e o proxy reverso.
- O Nginx centraliza o tráfego e facilita a exposição de backend e frontend por portas bem definidas.
- O uso de um container dedicado ao proxy é uma escolha prática para separar responsabilidades e simplificar a implantação.

### 6. TLS e certificados
- O repositório já está preparado para uso de certificados SSL no diretório [cdn/ssl](cdn/ssl).
- A configuração atual aponta o Nginx para os arquivos `seu-certificado.pem` e `seu-certificado.key`, o que permite a exposição HTTPS com certificados locais ou de terceiros.

## Troubleshooting

### Backend não conecta ao SQL Server
- Verifique a connection string em [backend/appsettings.json](backend/appsettings.json)
- Confirme se o SQL Server está acessível pela rede do ambiente
- Valide usuário, senha e nome do banco

### Frontend não consegue acessar a API
- Confirme a URL em [frontend/.env](frontend/.env)
- Em emulador Android, prefira `10.0.2.2` em vez de `localhost`
- Verifique se o backend está rodando na porta 8092

### Problemas na instalação do frontend
- Execute `npm install` novamente
- Confirme a versão do Node.js
- Em caso de inconsistência de dependências, remova a pasta `node_modules` e reinstale
