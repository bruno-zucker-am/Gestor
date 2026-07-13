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
    public class ClienteController : ControllerBase
    {
        private readonly IClienteService _service;

        public ClienteController(IClienteService service)
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

         // Método para criar um novo cliente
        [HttpPost]
        public async Task<ActionResult<ClienteReadDto>> Create([FromBody] ClienteCreateDto dto)
        {
            var cliente = await _service.CreateAsync(dto, ObterMasterIdDaRequisicao());
            return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
        }

        // Método para obter todos os clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteReadDto>>> GetAll()
        {
            return Ok(await _service.GetAllAsync(ObterMasterIdDaRequisicao()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteReadDto>> GetById(int id)
        {
            var cliente = await _service.GetByIdAsync(id, ObterMasterIdDaRequisicao());
            if (cliente == null) return NotFound();

            return Ok(cliente);
        }

        // Método para atualizar um cliente específico pelo ID
        [HttpPatch("{id}")]
        public async Task<ActionResult<ClienteReadDto>> Update(int id, [FromBody] ClienteUpdateDto dto)
        {
            var cliente = await _service.UpdateAsync(id, dto, ObterMasterIdDaRequisicao());
            if (cliente == null) return NotFound();

            return Ok(cliente);
        }

        // Método para deletar um cliente específico pelo ID
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id, ObterMasterIdDaRequisicao());
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
