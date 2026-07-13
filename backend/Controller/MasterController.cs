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
public class MasterController : ControllerBase
{
    private readonly AppDbContext _context;

    public MasterController(AppDbContext context)
    {
        _context = context;
    }

    // Método para criar um novo master
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MasterCreateDto masterDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Instancia o objeto satisfazendo todos os campos 'required'
        var master = new Master
        {
            Usuario = masterDto.Usuario,
            Senha = masterDto.Senha
        };

        // Sobrescreve a senha instantaneamente com o hash seguro
        var hasher = new PasswordHasher<Master>();
        master.Senha = hasher.HashPassword(master, masterDto.Senha);

        _context.Master.Add(master);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Master criado com sucesso!" });
    }

    // Método para obter todos os masters
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MasterReadDto>>> GetAll()
    {
        var masters = await _context.Master
            .Select(m => new MasterReadDto
            {
                Id = m.Id,
                Usuario = m.Usuario
            })
            .ToListAsync();

        return Ok(masters);
    }

    // Método para obter um master específico pelo ID
    [HttpGet("{id}")]
    public async Task<ActionResult<MasterReadDto>> GetById(int id)
    {
        var master = await _context.Master.FindAsync(id);

        if (master == null) return NotFound(new { erro = "Master não encontrado." });

        return Ok(new MasterReadDto
        {
            Id = master.Id,
            Usuario = master.Usuario
        });
    }

    // Método para atualizar um master específico pelo ID
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] MasterUpdateDto masterDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var master = await _context.Master.FindAsync(id);
        if (master == null) return NotFound(new { erro = "Master não encontrado." });

        if (!string.IsNullOrWhiteSpace(masterDto.Usuario)) 
            master.Usuario = masterDto.Usuario;

        if (!string.IsNullOrEmpty(masterDto.Senha))
        {
            var hasher = new PasswordHasher<Master>();
            master.Senha = hasher.HashPassword(master, masterDto.Senha);
        }

        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Master atualizado com sucesso!" });
    }

    // Método para deletar um master específico pelo ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var master = await _context.Master.FindAsync(id);
        if (master == null) return NotFound(new { erro = "Master não encontrado." });

        _context.Master.Remove(master);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Master deletado com sucesso!" });
    }
}
