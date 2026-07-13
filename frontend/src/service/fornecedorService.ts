import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IFornecedorRead,
  IFornecedorCreate,
  IFornecedorUpdate,
} from "@src/model/fornecedorModel";

const pegarCabecalhosAutenticacao = async () => {
  const tipoUsuario = await AsyncStorage.getItem("tipoUsuario");
  const usuarioId = await AsyncStorage.getItem("usuarioId");

  const headers: Record<string, string> = {};
  if (tipoUsuario === "master" && usuarioId) {
    headers["X-Master-Id"] = usuarioId;
  }

  return headers;
};

export const FornecedorService = {
  // GET: Lista todos os fornecedores
  async buscarFornecedores(): Promise<IFornecedorRead[]> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar fornecedores.");
    }

    return await response.json();
  },

  // GET: Busca um fornecedor por ID
  async buscarFornecedor(id: number): Promise<IFornecedorRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar fornecedor.");
    }

    return await response.json();
  },

  // POST: Cria um novo fornecedor
  async criarFornecedor(data: IFornecedorCreate): Promise<IFornecedorRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor`;
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
      throw new Error("Erro ao criar fornecedor.");
    }

    return await response.json();
  },

  // PUT: Atualiza um fornecedor existente
  async atualizarFornecedor(
    id: number,
    data: IFornecedorUpdate,
  ): Promise<IFornecedorRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar fornecedor.");
    }

    return await response.json();
  },

  // DELETE: Remove um fornecedor
  async deletarFornecedor(id: number): Promise<void> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar fornecedor.");
    }
  },
};
