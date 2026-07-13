import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IAdministradorRead,
  IAdministradorCreate,
  IAdministradorUpdate,
  IAdministradorResponse,
} from "@src/model/administradorModel";

const pegarCabecalhosAutenticacao = async () => {
  const tipoUsuario = await AsyncStorage.getItem("tipoUsuario");
  const usuarioId = await AsyncStorage.getItem("usuarioId");

  const headers: Record<string, string> = {};
  if (tipoUsuario === "master" && usuarioId) {
    headers["X-Master-Id"] = usuarioId;
  }

  return headers;
};

export const AdministradorService = {
  // GET: Lista todos os administradores
  async buscarAdministradores(): Promise<IAdministradorRead[]> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/administrador`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar administradores.");
    }

    return await response.json();
  },

  // GET: Busca um administrador por ID
  async buscarAdministrador(id: number): Promise<IAdministradorRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/administrador/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      // Tenta extrair a mensagem de erro formatada do backend ("Administrador não encontrado.")
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Erro ao buscar administrador.");
    }

    return await response.json();
  },

  // POST: Cria um novo administrador
  async criarAdministrador(
    data: IAdministradorCreate,
  ): Promise<IAdministradorResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/administrador`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar administrador.");
    }

    return await response.json(); // Retorna { mensagem: "Administrador criado com sucesso!" }
  },

  // PATCH: Atualiza um administrador existente
  async atualizarAdministrador(
    id: number,
    data: IAdministradorUpdate,
  ): Promise<IAdministradorResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/administrador/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Erro ao atualizar administrador.");
    }

    return await response.json(); // Retorna { mensagem: "Administrador atualizado com sucesso!" }
  },

  // DELETE: Remove um administrador
  async deletarAdministrador(id: number): Promise<IAdministradorResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/administrador/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Erro ao deletar administrador.");
    }

    return await response.json(); // Retorna { mensagem: "Administrador deletado com sucesso!" }
  },
};
