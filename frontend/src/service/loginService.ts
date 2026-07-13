import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ILoginRequest,
  ILoginResponse,
  ILogoutResponse,
} from "@src/model/loginModel";

const pegarCabecalhosAutenticacao = async () => {
  const tipoUsuario = await AsyncStorage.getItem("tipoUsuario");
  const usuarioId = await AsyncStorage.getItem("usuarioId");

  const headers: Record<string, string> = {};
  if (tipoUsuario === "master" && usuarioId) {
    headers["X-Master-Id"] = usuarioId;
  }

  return headers;
};

// Serviço para interagir com a API de login
export const LoginService = {
  // Função para realizar login
  async login(data: ILoginRequest): Promise<ILoginResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/login/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await pegarCabecalhosAutenticacao()),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Tenta extrair a mensagem mensagem do backend
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Falha na autenticação.");
    }

    return await response.json();
  },

  // Função para realizar logout
  async logout(): Promise<ILogoutResponse> {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/login/logout`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao realizar logout.");
    }

    return await response.json();
  },
};
