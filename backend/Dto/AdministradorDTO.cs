using System.ComponentModel.DataAnnotations;

namespace ProjetosDB.Dto
{
    // DTO para leitura de administrador (GET)
    public class AdministradorReadDto
    {
        public int Id { get; set; }
        public required string Usuario { get; set; }
    }

    // DTO para criar um administrador (POST)
    public class AdministradorCreateDto
    {
        public required string Usuario { get; set; } 
        public required string Senha { get; set; }
    }

    // DTO para atualizar administrador (PATCH)
    public class AdministradorUpdateDto
    {
        public string? Usuario { get; set; } 
        public string? Senha { get; set; } 
    }
}