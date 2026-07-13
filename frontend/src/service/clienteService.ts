import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IClienteRead,
  IClienteCreate,
  IClienteUpdate,
} from "@src/model/clienteModel";

const getAuthHeaders = async () => {
  const tipoUsuario = await AsyncStorage.getItem("tipoUsuario");
  const usuarioId = await AsyncStorage.getItem("usuarioId");

  const headers: Record<string, string> = {};
  if (tipoUsuario === "master" && usuarioId) {
    headers["X-Master-Id"] = usuarioId;
  }

  return headers;
};

export const ClienteService = {
  // GET: Lista todos os clientes
  async buscarClientes(): Promise<IClienteRead[]> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/cliente`;
    const headers = await getAuthHeaders();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar clientes.");
    }

    return await response.json();
  },

  // GET: Busca um cliente por ID
  async buscarCliente(id: number): Promise<IClienteRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/cliente/${id}`;
    const headers = await getAuthHeaders();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar cliente.");
    }

    return await response.json();
  },

  // POST: Cria um novo cliente
  async criarCliente(data: IClienteCreate): Promise<IClienteRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/cliente`;
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar cliente.");
    }

    return await response.json();
  },

  // PATCH: Atualiza um cliente existente
  async atualizarCliente(
    id: number,
    data: IClienteUpdate,
  ): Promise<IClienteRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/cliente/${id}`;
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar cliente.");
    }

    return await response.json();
  },

  // DELETE: Remove um cliente
  async deletarCliente(id: number): Promise<void> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/cliente/${id}`;
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar cliente.");
    }
  },
};
