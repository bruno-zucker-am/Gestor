using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProjetosDB.Dto;
using ProjetosDB.Service;

namespace ProjetosDB.Controller
{
    [ApiController]
    // Rota base para o controlador, usando o nome da classe sem o sufixo "Controller"
    [Route("api/[controller]")]
    public class RevendedorController : ControllerBase
    {
        private readonly IRevendedorService _service;

        public RevendedorController(IRevendedorService service)
        {
            _service = service;
        }

        private int? ObterMasterIdDaRequisicao()
        {
            if (Request.Headers.TryGetValue("X-Master-Id", out var values) && int.TryParse(values.ToString(), out var masterId))
            {
                return masterId;
            }

            return null;
        }

        // Método para criar um novo revendedor
        [HttpPost]
        public async Task<ActionResult<RevendedorReadDto>> Create([FromBody] RevendedorCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var revendedor = await _service.CreateAsync(dto, ObterMasterIdDaRequisicao());
            return CreatedAtAction(nameof(GetById), new { id = revendedor.Id }, revendedor);
        }

        // Método para obter todos os revendedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RevendedorReadDto>>> GetAll()
        {
            var revendedor = await _service.GetAllAsync(ObterMasterIdDaRequisicao());
            return Ok(revendedor);
        }

        // Método para obter um revendedor específico pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<RevendedorReadDto>> GetById(int id)
        {
            var revendedor = await _service.GetByIdAsync(id, ObterMasterIdDaRequisicao());
            if (revendedor == null) return NotFound();

            return Ok(revendedor);
        }

        // Método para atualizar um revendedor específico pelo ID
        [HttpPatch("{id}")]
        public async Task<ActionResult<RevendedorReadDto>> Update(int id, [FromBody] RevendedorUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var revendedor = await _service.UpdateAsync(id, dto, ObterMasterIdDaRequisicao());
            if (revendedor == null) return NotFound();

            return Ok(revendedor);
        }

        // Método para deletar um revendedor específico pelo ID
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id, ObterMasterIdDaRequisicao());
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}