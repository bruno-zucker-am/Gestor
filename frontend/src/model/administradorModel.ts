// DTO para a leitura/retorno (GET)
export interface IAdministradorRead {
  id: number;
  usuario: string;
}

// DTO para a criação (POST)
export interface IAdministradorCreate {
  usuario: string;
  senha: string;
}

// DTO para a atualização (PATCH)
export interface IAdministradorUpdate {
  usuario?: string;
  senha?: string;
}

// Interface para mapear o retorno de sucesso padrão do Controller (POST, PATCH, DELETE)
export interface IAdministradorResponse {
  mensagem: string;
}
