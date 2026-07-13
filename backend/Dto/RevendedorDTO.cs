using System.ComponentModel.DataAnnotations;

namespace ProjetosDB.Dto
{
    // DTO para a leitura/retorno dos dados de um revendedor (GET)
    public class RevendedorReadDto
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public required int QuantidadeLogin { get; set; }
        public required DateTime Vencimento { get; set; } = DateTime.UtcNow;
        public required int Valor { get; set; }
        public required DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public required DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;
    }

    // DTO para a criação de um novo revendedor (POST)
    public class RevendedorCreateDto
    {
        public required string Nome { get; set; }
        public required int QuantidadeLogin { get; set; }
        public required DateTime Vencimento { get; set; } = DateTime.UtcNow;
        public required int Valor { get; set; }
    }

    // DTO para a atualização de um revendedor (PATCH)
    public class RevendedorUpdateDto
    {
        public string? Nome { get; set; }
        public int? QuantidadeLogin { get; set; }
        public DateTime? Vencimento { get; set; }
        public int? Valor { get; set; }
    }
}