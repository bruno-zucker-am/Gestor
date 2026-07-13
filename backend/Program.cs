using Microsoft.EntityFrameworkCore;
using ProjetosDB.Data;
using ProjetosDB.Service;
using System.Text.Json;

// Criação do builder da aplicação
var builder = WebApplication.CreateBuilder(args);

// Injeção de Dependência
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Adicionando os serviços de Revendedor, Cliente e Fornecedor
builder.Services.AddScoped<IRevendedorService, RevendedorService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IFornecedorService, FornecedorService>();

// Adicionando o serviço de HttpContextAccessor para acessar os cabeçalhos da requisição
builder.Services.AddHttpContextAccessor();

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", b => b
        .SetIsOriginAllowed(origin => true) 
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());               
});

// Configuração dos Controladores com suporte a CamelCase do JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

var app = builder.Build();

// Arquivos estáticos e arquivos padrão (como index.html) serão servidos
app.UseDefaultFiles();
app.UseStaticFiles();

// Configuração do roteamento e CORS
app.UseRouting(); 
app.UseCors("AllowAll");

// Configuração de autenticação e autorização
app.UseAuthentication();
app.UseAuthorization();

// Mapeamento dos controladores
app.MapControllers();

// Executa migração automática
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();
