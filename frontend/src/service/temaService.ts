import { useState, useEffect } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Serviço para manipulação do tema escuro/claro
const CHAVE_STORAGE: string = "temaEscuro";

// Tipos e interfaces para o serviço de tema
interface TemaChangeListener {
  (valor: boolean): void;
}

// Interface para o serviço de tema
interface TemaService {
  alternarTema(): Promise<void>;
  definirTema(escuro: boolean): Promise<void>;
  readonly temaEscuroAtual: boolean;
}

// Interface para o retorno do hook useTema
interface UseTemaRetorno {
  temaEscuro: boolean;
  alternarTema(): Promise<void>;
  definirTema(escuro: boolean): Promise<void>;
}

// Estado global em memória para compartilhar o mesmo valor entre as telas
let temaEscuroGlobal: boolean = false;
const ouvintes: Set<TemaChangeListener> = new Set();

try {
  temaEscuroGlobal = Appearance.getColorScheme() === "dark";
} catch {
  temaEscuroGlobal = false;
}

// Busca o valor salvo assim que o app abre
AsyncStorage.getItem(CHAVE_STORAGE)
  .then((salvo: string | null) => {
    try {
      if (salvo !== null) {
        temaEscuroGlobal = salvo === "true";
        ouvintes.forEach((cb) => cb(temaEscuroGlobal));
      }
    } catch {}
  })
  .catch(() => {});

// Escuta alterações do sistema operacional caso o usuário mude o tema do celular
try {
  Appearance.addChangeListener(
    ({ colorScheme }: { colorScheme: ColorSchemeName | null }) => {
      AsyncStorage.getItem(CHAVE_STORAGE)
        .then((salvo: string | null) => {
          try {
            if (salvo === null) {
              temaEscuroGlobal = colorScheme === "dark";
              ouvintes.forEach((cb) => cb(temaEscuroGlobal));
            }
          } catch {}
        })
        .catch(() => {});
    },
  );
} catch {}

// Funções de manipulação direta: equivalente aos métodos do service
export const temaService: TemaService = {
  async alternarTema() {
    temaEscuroGlobal = !temaEscuroGlobal;
    ouvintes.forEach((cb) => cb(temaEscuroGlobal));
    try {
      await AsyncStorage.setItem(CHAVE_STORAGE, String(temaEscuroGlobal));
    } catch {}
  },

  // Define o tema explicitamente
  async definirTema(escuro: boolean) {
    temaEscuroGlobal = escuro;
    ouvintes.forEach((cb) => cb(temaEscuroGlobal));
    try {
      await AsyncStorage.setItem(CHAVE_STORAGE, String(temaEscuroGlobal));
    } catch {}
  },

  // Retorna o valor atual do tema escuro
  get temaEscuroAtual(): boolean {
    return temaEscuroGlobal;
  },
};

// Hook do React Native para os componentes usarem e re-renderizarem automaticamente
export function useTema(): UseTemaRetorno {
  const [temaEscuro, setTemaEscuro] = useState<boolean>(temaEscuroGlobal);

  // Adiciona um ouvinte para atualizar o estado do tema quando ele mudar
  useEffect(() => {
    ouvintes.add(setTemaEscuro);
    return () => {
      ouvintes.delete(setTemaEscuro);
    };
  }, []);

  // Retorna o estado do tema e as funções para alternar e definir o tema
  return {
    temaEscuro,
    alternarTema: temaService.alternarTema,
    definirTema: temaService.definirTema,
  };
}
