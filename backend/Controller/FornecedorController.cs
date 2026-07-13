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
    public class FornecedorController : ControllerBase
    {
        private readonly IFornecedorService _service;

        public FornecedorController(IFornecedorService service)
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

        // Método para criar um novo fornecedor
        [HttpPost]
        public async Task<ActionResult<FornecedorReadDto>> Create([FromBody] FornecedorCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var fornecedor = await _service.CreateAsync(dto, ObterMasterIdDaRequisicao());
            return CreatedAtAction(nameof(GetById), new { id = fornecedor.Id }, fornecedor);
        }

        // Método para obter todos os fornecedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FornecedorReadDto>>> GetAll()
        {
            var fornecedor = await _service.GetAllAsync(ObterMasterIdDaRequisicao());
            return Ok(fornecedor);
        }

        // Método para obter um fornecedor específico pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<FornecedorReadDto>> GetById(int id)
        {
            var fornecedor = await _service.GetByIdAsync(id, ObterMasterIdDaRequisicao());
            if (fornecedor == null) return NotFound();

            return Ok(fornecedor);
        }

        // Método para atualizar um fornecedor específico pelo ID
        [HttpPatch("{id}")]
        public async Task<ActionResult<FornecedorReadDto>> Update(int id, [FromBody] FornecedorUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var fornecedor = await _service.UpdateAsync(id, dto, ObterMasterIdDaRequisicao());
            if (fornecedor == null) return NotFound();

            return Ok(fornecedor);
        }

        // Método para deletar um fornecedor específico pelo ID
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id, ObterMasterIdDaRequisicao());
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
