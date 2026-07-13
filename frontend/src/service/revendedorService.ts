import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IRevendedorRead,
  IRevendedorCreate,
  IRevendedorUpdate,
} from "@src/model/revendedorModel";

// Função para obter os cabeçalhos de autenticação
const pegarCabecalhosAutenticacao = async () => {
  const tipoUsuario = await AsyncStorage.getItem("tipoUsuario");
  const usuarioId = await AsyncStorage.getItem("usuarioId");

  const headers: Record<string, string> = {};
  if (tipoUsuario === "master" && usuarioId) {
    headers["X-Master-Id"] = usuarioId;
  }

  return headers;
};

// Serviço para interagir com a API de revendedores
export const RevendedorService = {
  // GET: Lista todos os revendedores
  async buscarRevendedores(): Promise<IRevendedorRead[]> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/revendedor`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar revendedores.");
    }

    return await response.json();
  },

  // GET: Busca um revendedor por ID
  async buscarRevendedor(id: number): Promise<IRevendedorRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/revendedor/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar revendedor.");
    }

    return await response.json();
  },

  // POST: Cria um novo revendedor
  async criarRevendedor(data: IRevendedorCreate): Promise<IRevendedorRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/revendedor`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar revendedor.");
    }

    return await response.json();
  },

  // PATCH: Atualiza um revendedor existente
  async atualizarRevendedor(
    id: number,
    data: IRevendedorUpdate,
  ): Promise<IRevendedorRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/revendedor/${id}`;
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
      throw new Error("Erro ao atualizar revendedor.");
    }

    return await response.json();
  },

  // DELETE: Remove um revendedor
  async deletarRevendedor(id: number): Promise<void> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/revendedor/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar revendedor.");
    }
  },
};
