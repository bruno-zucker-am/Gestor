import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IMasterRead,
  IMasterCreate,
  IMasterUpdate,
  IMasterResponse,
} from "@src/model/masterModel";

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

export const MasterService = {
  // GET: Lista todos os masters
  async buscarMasters(): Promise<IMasterRead[]> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/master`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Erro ao buscar masters.");
    }

    return await response.json();
  },

  // GET: Busca um master por ID
  async buscarMaster(id: number): Promise<IMasterRead> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/master/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, { headers });

    if (!response.ok) {
      // Tenta extrair a mensagem "Master não encontrado." do backend
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Erro ao buscar master.");
    }

    return await response.json();
  },

  // POST: Cria um novo master
  async criarMaster(data: IMasterCreate): Promise<IMasterResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/master`;
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
      throw new Error("Erro ao criar master.");
    }

    return await response.json(); // Retorna { mensagem: "Master cadastrado com sucesso!" }
  },

  // PATCH: Atualiza um master existente
  async atualizarMaster(
    id: number,
    data: IMasterUpdate,
  ): Promise<IMasterResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/master/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "PATCH", // Usando PATCH conforme definido no seu Controller
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Erro ao atualizar master.");
    }

    return await response.json(); // Retorna { mensagem: "Master atualizado com sucesso!" }
  },

  // DELETE: Remove um master
  async deletarMaster(id: number): Promise<IMasterResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/master/${id}`;
    const headers = await pegarCabecalhosAutenticacao();
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Erro ao deletar master.");
    }

    return await response.json(); // Retorna { mensagem: "Master deletado com sucesso!" }
  },
};
