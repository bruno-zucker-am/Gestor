namespace ProjetosDB.Model
{
    public class Revendedor
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public required int QuantidadeLogin { get; set; }
        public required DateTime Vencimento { get; set; } = DateTime.UtcNow;
        public required int Valor { get; set; }
        public required DateTime CriadoEm { get; set; } = DateTime.UtcNow;
        public required DateTime AtualizadoEm { get; set; } = DateTime.UtcNow;

        // Relacionamento com a tabela Master
        public int? MasterId { get; set; }
    }
}