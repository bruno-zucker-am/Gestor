// DTO para a leitura/retorno (GET)
export interface IMasterRead {
  id: number;
  usuario: string;
}

// DTO para a criação (POST)
export interface IMasterCreate {
  usuario: string;
  senha: string;
}

// DTO para a atualização (PATCH)
export interface IMasterUpdate {
  usuario?: string;
  senha?: string;
}

// Interface para mapear o retorno de sucesso padrão do Controller
export interface IMasterResponse {
  mensagem: string;
}
