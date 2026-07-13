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
    // Interface para o serviço de Revendedor
    public interface IRevendedorService
    {
        Task<IEnumerable<RevendedorReadDto>> GetAllAsync(int? masterId = null);
        Task<RevendedorReadDto?> GetByIdAsync(int id, int? masterId = null);
        Task<RevendedorReadDto> CreateAsync(RevendedorCreateDto dto, int? masterId = null);
        Task<RevendedorReadDto?> UpdateAsync(int id, RevendedorUpdateDto dto, int? masterId = null);
        Task<bool> DeleteAsync(int id, int? masterId = null);
    }

    // Implementação do serviço de Revendedor
    public class RevendedorService : IRevendedorService
    {
        private readonly AppDbContext _context;

        public RevendedorService(AppDbContext context)
        {
            _context = context;
        }

        // Método para obter todos os revendedores, com filtro opcional por MasterId
        public async Task<IEnumerable<RevendedorReadDto>> GetAllAsync(int? masterId = null)
        {
            var query = _context.Set<Revendedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(r => r.MasterId == masterId.Value);
            }

            var revendedores = await query.ToListAsync();
            return revendedores.Select(MapToReadDto);
        }

        // Método para obter um revendedor específico pelo ID, com filtro opcional por MasterId
        public async Task<RevendedorReadDto?> GetByIdAsync(int id, int? masterId = null)
        {
            var query = _context.Set<Revendedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(r => r.MasterId == masterId.Value);
            }

            var revendedor = await query.FirstOrDefaultAsync(r => r.Id == id);
            if (revendedor == null) return null;

            return MapToReadDto(revendedor);
        }

        // Método para criar um novo revendedor, com filtro opcional por MasterId
        public async Task<RevendedorReadDto> CreateAsync(RevendedorCreateDto dto, int? masterId = null)
        {
            // Usando DateTime.Now para pegar a data real no formato esperado pelo C#
            var dataAtual = DateTime.Now; 

            var revendedor = new Revendedor
            {
                MasterId = masterId,
                Nome = dto.Nome,
                QuantidadeLogin = dto.QuantidadeLogin,
                Vencimento = dto.Vencimento,
                Valor = dto.Valor,
                CriadoEm = dataAtual,
                AtualizadoEm = dataAtual
            };

            _context.Set<Revendedor>().Add(revendedor);
            await _context.SaveChangesAsync();

            return MapToReadDto(revendedor);
        }

        // Método para atualizar um revendedor específico pelo ID, com filtro opcional por MasterId
        public async Task<RevendedorReadDto?> UpdateAsync(int id, RevendedorUpdateDto dto, int? masterId = null)
        {
            var query = _context.Set<Revendedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(r => r.MasterId == masterId.Value);
            }

            var revendedor = await query.FirstOrDefaultAsync(r => r.Id == id);
            if (revendedor == null) return null;

            if (dto.Nome != null) revendedor.Nome = dto.Nome;
            
            // Adicionado o .Value ou usando .HasValue para extrair o dado corretamente dos nullables
            if (dto.Vencimento.HasValue) revendedor.Vencimento = dto.Vencimento.Value;
            if (dto.QuantidadeLogin.HasValue) revendedor.QuantidadeLogin = dto.QuantidadeLogin.Value;
            if (dto.Valor.HasValue) revendedor.Valor = dto.Valor.Value;

            // O backend define sozinho que ocorreu uma atualização neste exato momento
            revendedor.AtualizadoEm = DateTime.Now; 

            _context.Set<Revendedor>().Update(revendedor);
            await _context.SaveChangesAsync();

            return MapToReadDto(revendedor);
        }

        // Método para deletar um revendedor específico pelo ID, com filtro opcional por MasterId
        public async Task<bool> DeleteAsync(int id, int? masterId = null)
        {
            var query = _context.Set<Revendedor>().AsQueryable();
            if (masterId.HasValue)
            {
                query = query.Where(r => r.MasterId == masterId.Value);
            }

            var revendedor = await query.FirstOrDefaultAsync(r => r.Id == id);
            if (revendedor == null) return false;

            _context.Set<Revendedor>().Remove(revendedor);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapeamento de entidade Revendedor para DTO de leitura
        private static RevendedorReadDto MapToReadDto(Revendedor revendedor)
        {
            return new RevendedorReadDto
            {
                Id = revendedor.Id,
                Nome = revendedor.Nome,
                QuantidadeLogin = revendedor.QuantidadeLogin,
                Vencimento = revendedor.Vencimento,
                Valor = revendedor.Valor,
                CriadoEm = revendedor.CriadoEm,
                AtualizadoEm = revendedor.AtualizadoEm
            };
        }
    }
}