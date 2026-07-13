using System;
using System.ComponentModel.DataAnnotations;

namespace ProjetosDB.Dto
{
    // DTO para a leitura (GET)
    public class FornecedorReadDto
    {
        public int Id { get; set; }
        public required string Nome { get; set; } 
        public required string TipoServico { get; set; } 
        public required DateTime Vencimento { get; set; }
        public required int Valor { get; set; }
        public DateTime CriadoEm { get; set; }
        public DateTime AtualizadoEm { get; set; }
    }

    // DTO para a criação (POST)
    public class FornecedorCreateDto
    {
        public required string Nome { get; set; } 
        public required string TipoServico { get; set; } 
        public required DateTime Vencimento { get; set; }
        public required int Valor { get; set; }
    }

    // DTO para a atualização (PATCH)
    public class FornecedorUpdateDto
    {
        public string? Nome { get; set; } 
        public string? TipoServico { get; set; }
        public DateTime? Vencimento { get; set; } 
        public int? Valor { get; set; }
    }
}
