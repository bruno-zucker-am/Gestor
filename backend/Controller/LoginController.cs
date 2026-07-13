using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ProjetosDB.Data;
using ProjetosDB.Model;
using ProjetosDB.Dto;

namespace ProjetosDB.Controller;

[ApiController]
// Rota base para o controlador, usando o nome da classe sem o sufixo "Controller"
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly AppDbContext _context;

    public LoginController(AppDbContext context)
    {
        _context = context;
    }

    // Método para realizar o login de um usuário (Administrador ou Master)
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // O [ApiController] valida automaticamente os atributos [Required] do LoginRequest.
        // Se estiver inválido, o ASP.NET já retorna um erro automaticamente.
        // Lógica de busca Administrador
        var administrador = await _context.Administrador
            .FirstOrDefaultAsync(a => a.Usuario == request.identificador);

        if (administrador != null)
        {
            var hasher = new PasswordHasher<Administrador>();
            var result = hasher.VerifyHashedPassword(administrador, administrador.Senha, request.senha!);

            if (result == PasswordVerificationResult.Success)
            {
                return Ok(new { tipo = "administrador", usuario = administrador.Usuario, id = administrador.Id });
            }
        }

        // Lógica de busca do Master
        var master = await _context.Master.FirstOrDefaultAsync(m => m.Usuario == request.identificador);
        if (master != null)
        {
            var hasher = new PasswordHasher<Master>();
            var result = hasher.VerifyHashedPassword(master, master.Senha, request.senha!);

            if (result == PasswordVerificationResult.Success)
            {
                return Ok(new { tipo = "master", usuario = master.Usuario, id = master.Id });
            }
        }

        // Retorno de erro único para segurança (não revela qual usuário existe)
        return BadRequest(new { erro = "Credenciais inválidas." });
    }

    // Método para realizar o logout do usuário
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { mensagem = "Logout realizado com sucesso!" });
    }
}
