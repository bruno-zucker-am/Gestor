using System.ComponentModel.DataAnnotations;

namespace ProjetosDB.Dto
{
    // DTO para a requisição de login
    public class LoginRequest
    {
        private string? _identificador;
        private string? _senha;

        [Required(ErrorMessage = "O identificador é obrigatório.")]
        public string? identificador
        {
            get => _identificador;
            set => _identificador = value?.Trim().ToLower();
        }
    
        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string? senha
        {
            get => _senha;
            set => _senha = value?.Trim();
        }
    }
}