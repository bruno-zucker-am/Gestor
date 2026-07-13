using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjetosDB.Dto;
using ProjetosDB.Model;
using ProjetosDB.Data;
using System;

namespace ProjetosDB.Service
{
    // Interface para o serviço de Cliente
    public interface IClienteService
    {
        Task<IEnumerable<ClienteReadDto>> GetAllAsync(int? masterId = null);
        Task<ClienteReadDto?> GetByIdAsync(int id, int? masterId = null);
        Task<ClienteReadDto> CreateAsync(ClienteCreateDto dto, int? masterId = null);
        Task<ClienteReadDto?> UpdateAsync(int id, ClienteUpdateDto dto, int? masterId = null);
        Task<bool> DeleteAsync(int id, int? masterId = null);
    }

    // Implementação do serviço de Cliente
    public class ClienteService : IClienteService
    {
        private readonly AppDbContext _context;

        public ClienteService(AppDbContext context)
        {
            _context = context;
        }

        // Método para obter todos os clientes, com filtro opcional por MasterId
        public async Task<IEnumerable<ClienteReadDto>> GetAllAsync(int? masterId = null)
        {
            var query = _context.Set<Cliente>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(c => c.MasterId == masterId.Value);
            }

            var clientes = await query.ToListAsync();
            return clientes.Select(MapToReadDto);
        }

        // Método para obter um cliente específico pelo ID, com filtro opcional por MasterId
        public async Task<ClienteReadDto?> GetByIdAsync(int id, int? masterId = null)
        {
            var query = _context.Set<Cliente>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(c => c.MasterId == masterId.Value);
            }

            var cliente = await query.FirstOrDefaultAsync(c => c.Id == id);
            if (cliente == null) return null;

            return MapToReadDto(cliente);
        }

        // Método para criar um novo cliente, com filtro opcional por MasterId
        public async Task<ClienteReadDto> CreateAsync(ClienteCreateDto dto, int? masterId = null)
        {
            var cliente = new Cliente
            {
                MasterId = masterId,
                Nome = dto.Nome,
                QuantidadeAcesso = dto.QuantidadeAcesso,
                Vencimento = dto.Vencimento,
                Valor = dto.Valor,
                CriadoEm = DateTime.UtcNow,
                AtualizadoEm = DateTime.UtcNow
            };

            _context.Set<Cliente>().Add(cliente);
            await _context.SaveChangesAsync();

            return MapToReadDto(cliente);
        }

        // Método para atualizar um cliente específico pelo ID, com filtro opcional por MasterId
        public async Task<ClienteReadDto?> UpdateAsync(int id, ClienteUpdateDto dto, int? masterId = null)
        {
            var query = _context.Set<Cliente>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(c => c.MasterId == masterId.Value);
            }

            var cliente = await query.FirstOrDefaultAsync(c => c.Id == id);
            if (cliente == null) return null;

            // Atualização de campos permitidos
            if (dto.Nome != null) cliente.Nome = dto.Nome;
            if (dto.Vencimento.HasValue) cliente.Vencimento = dto.Vencimento.Value;
            if (dto.QuantidadeAcesso.HasValue) cliente.QuantidadeAcesso = dto.QuantidadeAcesso.Value;
            if (dto.Valor.HasValue) cliente.Valor = dto.Valor.Value;
            
            // Auditoria automática (não exposta no DTO de Update)
            cliente.AtualizadoEm = DateTime.UtcNow;

            // O EF Core já está rastreando a entidade; basta salvar
            await _context.SaveChangesAsync();

            return MapToReadDto(cliente);
        }

        // Método para deletar um cliente específico pelo ID, com filtro opcional por MasterId
        public async Task<bool> DeleteAsync(int id, int? masterId = null)
        {
            var query = _context.Set<Cliente>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(c => c.MasterId == masterId.Value);
            }

            var cliente = await query.FirstOrDefaultAsync(c => c.Id == id);
            if (cliente == null) return false;

            _context.Set<Cliente>().Remove(cliente);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapeamento de entidade Cliente para DTO de leitura
        private static ClienteReadDto MapToReadDto(Cliente cliente)
        {
            return new ClienteReadDto
            {
                Id = cliente.Id,
                Nome = cliente.Nome,
                QuantidadeAcesso = cliente.QuantidadeAcesso,
                Vencimento = cliente.Vencimento,
                Valor = cliente.Valor,                      
                CriadoEm = cliente.CriadoEm,
                AtualizadoEm = cliente.AtualizadoEm
            };
        }
    }
}