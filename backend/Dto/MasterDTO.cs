namespace ProjetosDB.Dto
{
    // DTO para leitura de master (GET)
    public class MasterReadDto
    {
        public int Id { get; set; }
        public required string Usuario { get; set; }
    }
    
    // DTO para criar um master (POST)
    public class MasterCreateDto
    {
        public required string Usuario { get; set; }
        public required string Senha { get; set; } 
    }

    // DTO para atualizar master (PATCH)
    public class MasterUpdateDto
    {
        public string? Usuario { get; set; }
        public string? Senha { get; set; }
    }
}
