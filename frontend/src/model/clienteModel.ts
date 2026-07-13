// DTO para a leitura/retorno (GET)
export interface IClienteRead {
  id: number;
  nome: string;
  quantidadeAcesso: number;
  vencimento: string;
  valor: number;
  criadoEm: string;
  atualizadoEm: string;
}

// DTO para a criação (POST)
export interface IClienteCreate {
  nome: string;
  quantidadeAcesso: number;
  vencimento: string;
  valor: number;
}

// DTO para a atualização (PATCH)
export interface IClienteUpdate {
  nome?: string;
  quantidadeAcesso?: number;
  vencimento?: string;
  valor?: number;
}
