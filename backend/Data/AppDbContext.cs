using Microsoft.EntityFrameworkCore;
// Nome do banco de dados e o namespace do projeto
using ProjetosDB.Model;

// Define o namespace para a classe AppDbContext
namespace ProjetosDB.Data;

// class AppDbContext herda de DbContext, que é a classe base do Entity Framework Core para trabalhar com bancos de dados.
public class AppDbContext : DbContext
{
    // Construtor que recebe opções de configuração do DbContext
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Define os DbSets para cada entidade do modelo
    public DbSet<Administrador> Administrador { get; set; }
    public DbSet<Master> Master { get; set; }
    public DbSet<Revendedor> Revendedor { get; set; }
    public DbSet<Cliente> Cliente { get; set; }
    public DbSet<Fornecedor> Fornecedor { get; set; }

    // Configurações adicionais do modelo podem ser feitas aqui
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Define que todas as tabelas deste contexto pertencem ao schema "Gestor"
        modelBuilder.HasDefaultSchema("Gestor");

        // Configurações adicionais para cada entidade podem ser feitas aqui, se necessário
        base.OnModelCreating(modelBuilder);
    }
}
