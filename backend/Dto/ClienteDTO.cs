using System;

namespace ProjetosDB.Dto
{
    // DTO para a leitura/retorno dos dados de um cliente (GET)
    public class ClienteReadDto
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public required int QuantidadeAcesso { get; set; }
        public required DateTime Vencimento { get; set; }
        public required int Valor { get; set; }
        public DateTime CriadoEm { get; set; }
        public DateTime AtualizadoEm { get; set; }
    }

    // DTO para a criação de um novo cliente (POST)
    public class ClienteCreateDto
    {
        public required string Nome { get; set; }
        public required int QuantidadeAcesso { get; set; }
        public required DateTime Vencimento { get; set; } 
        public required int Valor { get; set; }
    }

    // DTO para a atualização de um cliente (PATCH)
    public class ClienteUpdateDto
    {
        public string? Nome { get; set; } 
        public int? QuantidadeAcesso { get; set; }
        public DateTime? Vencimento { get; set; } 
        public int? Valor { get; set; }
    }
}
