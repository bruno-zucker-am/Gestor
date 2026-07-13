using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProjetosDB.Dto;
using ProjetosDB.Model;
using ProjetosDB.Data;

namespace ProjetosDB.Service
{
    // Interface para o serviço de Fornecedor
    public interface IFornecedorService
    {
        Task<IEnumerable<FornecedorReadDto>> GetAllAsync(int? masterId = null);
        Task<FornecedorReadDto?> GetByIdAsync(int id, int? masterId = null);
        Task<FornecedorReadDto> CreateAsync(FornecedorCreateDto dto, int? masterId = null);
        Task<FornecedorReadDto?> UpdateAsync(int id, FornecedorUpdateDto dto, int? masterId = null);
        Task<bool> DeleteAsync(int id, int? masterId = null);
    }

    // Implementação do serviço de Fornecedor
    public class FornecedorService : IFornecedorService
    {
        private readonly AppDbContext _context;

        public FornecedorService(AppDbContext context)
        {
            _context = context;
        }

        // Método para obter todos os fornecedores, com filtro opcional por MasterId
        public async Task<IEnumerable<FornecedorReadDto>> GetAllAsync(int? masterId = null)
        {
            var query = _context.Set<Fornecedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(f => f.MasterId == masterId.Value);
            }

            var fornecedor = await query.ToListAsync();
            return fornecedor.Select(MapToReadDto);
        }

        // Método para obter um fornecedor específico pelo ID, com filtro opcional por MasterId
        public async Task<FornecedorReadDto?> GetByIdAsync(int id, int? masterId = null)
        {
            var query = _context.Set<Fornecedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(f => f.MasterId == masterId.Value);
            }

            var fornecedor = await query.FirstOrDefaultAsync(f => f.Id == id);
            if (fornecedor == null) return null;

            return MapToReadDto(fornecedor);
        }

        // Método para criar um novo fornecedor, com filtro opcional por MasterId
        public async Task<FornecedorReadDto> CreateAsync(FornecedorCreateDto dto, int? masterId = null)
        {
            var fornecedor = new Fornecedor
            {
                MasterId = masterId,
                Nome = dto.Nome,
                TipoServico = dto.TipoServico,
                Vencimento = dto.Vencimento,
                Valor = dto.Valor,
                CriadoEm = DateTime.UtcNow,
                AtualizadoEm = DateTime.UtcNow
            };

            _context.Set<Fornecedor>().Add(fornecedor);
            await _context.SaveChangesAsync();

            return MapToReadDto(fornecedor);
        }

        // Método para atualizar um fornecedor específico pelo ID, com filtro opcional por MasterId
        public async Task<FornecedorReadDto?> UpdateAsync(int id, FornecedorUpdateDto dto, int? masterId = null)
        {
            var query = _context.Set<Fornecedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(f => f.MasterId == masterId.Value);
            }

            var fornecedor = await query.FirstOrDefaultAsync(f => f.Id == id);
            if (fornecedor == null) return null;

            // Atualiza apenas os campos fornecidos
            if (dto.Nome != null) fornecedor.Nome = dto.Nome;
            if (dto.Vencimento.HasValue) fornecedor.Vencimento = dto.Vencimento.Value;
            if (dto.TipoServico != null) fornecedor.TipoServico = dto.TipoServico;
            if (dto.Valor.HasValue) fornecedor.Valor = dto.Valor.Value;
            
            // Controle exclusivo do servidor
            fornecedor.AtualizadoEm = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToReadDto(fornecedor);
        }

        // Método para deletar um fornecedor específico pelo ID, com filtro opcional por MasterId
        public async Task<bool> DeleteAsync(int id, int? masterId = null)
        {
            var query = _context.Set<Fornecedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(f => f.MasterId == masterId.Value);
            }

            var fornecedor = await query.FirstOrDefaultAsync(f => f.Id == id);
            if (fornecedor == null) return false;

            _context.Set<Fornecedor>().Remove(fornecedor);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapeamento de entidade Fornecedor para DTO de leitura
        private static FornecedorReadDto MapToReadDto(Fornecedor fornecedor)
        {
            return new FornecedorReadDto
            {
                Id = fornecedor.Id,
                Nome = fornecedor.Nome,
                TipoServico = fornecedor.TipoServico,
                Vencimento = fornecedor.Vencimento,
                Valor = fornecedor.Valor,
                CriadoEm = fornecedor.CriadoEm,
                AtualizadoEm = fornecedor.AtualizadoEm
            };
        }
    }
}