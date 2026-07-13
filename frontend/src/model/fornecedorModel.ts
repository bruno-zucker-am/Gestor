// DTO para a leitura/retorno (GET)
export interface IFornecedorRead {
  id: number;
  nome: string;
  tipoServico: string;
  vencimento: string;
  valor: number;
  criadoEm: string;
  atualizadoEm: string;
}

// DTO para a criação (POST)
export interface IFornecedorCreate {
  nome: string;
  tipoServico: string;
  vencimento: string;
  valor: number;
}

// DTO para a atualização (PATCH)
export interface IFornecedorUpdate {
  nome?: string;
  tipoServico?: string;
  vencimento?: string;
  valor?: number;
}
