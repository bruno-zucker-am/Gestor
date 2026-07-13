// DTO para a leitura/retorno (GET)
export interface IRevendedorRead {
  id: number;
  nome: string;
  quantidadeLogin: number;
  vencimento: string;
  valor: number;
  criadoEm: string;
  atualizadoEm: string;
}

// DTO para a criação (POST)
export interface IRevendedorCreate {
  nome: string;
  quantidadeLogin: number;
  vencimento: string;
  valor: number;
}

// DTO para a atualização (PATCH)
export interface IRevendedorUpdate {
  nome?: string;
  quantidadeLogin?: number;
  vencimento?: string;
  valor?: number;
}
