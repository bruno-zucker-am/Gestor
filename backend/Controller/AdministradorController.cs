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
public class AdministradorController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdministradorController(AppDbContext context)
    {
        _context = context;
    }

    // Método para criar um novo administrador
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AdministradorCreateDto administradorDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Instancia o objeto satisfazendo todos os campos 'required'
        var administrador = new Administrador
        {
            Usuario = administradorDto.Usuario,
            Senha = administradorDto.Senha
        };

        // Sobrescreve a senha instantaneamente com o hash seguro
        var hasher = new PasswordHasher<Administrador>();
        administrador.Senha = hasher.HashPassword(administrador, administradorDto.Senha);

        _context.Administrador.Add(administrador);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Administrador criado com sucesso!" });
    }

    // Método para obter todos os administradores
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdministradorReadDto>>> GetAll()
    {
        var administradores = await _context.Administrador
            .Select(a => new AdministradorReadDto
            {
                Id = a.Id,
                Usuario = a.Usuario
            })
            .ToListAsync();

        return Ok(administradores);
    }

    // Método para obter um administrador específico pelo ID
    [HttpGet("{id}")]
    public async Task<ActionResult<AdministradorReadDto>> GetById(int id)
    {
        var administrador = await _context.Administrador.FindAsync(id);

        if (administrador == null) return NotFound(new { erro = "Administrador não encontrado." });

        return Ok(new AdministradorReadDto
        {
            Id = administrador.Id,
            Usuario = administrador.Usuario
        });
    }

    // Método para atualizar um administrador específico pelo ID
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] AdministradorUpdateDto administradorDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var administrador = await _context.Administrador.FindAsync(id);

        if (administrador == null) return NotFound(new { erro = "Administrador não encontrado." });

        if (administradorDto.Usuario != null)
            administrador.Usuario = administradorDto.Usuario;

        if (!string.IsNullOrEmpty(administradorDto.Senha))
        {
            var hasher = new PasswordHasher<Administrador>();
            administrador.Senha = hasher.HashPassword(administrador, administradorDto.Senha);
        }

        await _context.SaveChangesAsync();
        return Ok(new { mensagem = "Administrador atualizado com sucesso!" });
    }

    // Método para deletar um administrador específico pelo ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var administrador = await _context.Administrador.FindAsync(id);

        if (administrador == null) return NotFound(new { erro = "Administrador não encontrado." });

        _context.Administrador.Remove(administrador);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Administrador deletado com sucesso!" });
    }
}
