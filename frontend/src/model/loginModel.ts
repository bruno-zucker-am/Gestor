// DTO para a requisição de login
export interface ILoginRequest {
  identificador: string;
  senha: string;
}

// O que recebemos da API em caso de sucesso no login
export interface ILoginResponse {
  tipo: "administrador" | "master";
  usuario: string;
  id: number;
}

// O que recebemos da API ao fazer logout
export interface ILogoutResponse {
  mensagem: string;
}
