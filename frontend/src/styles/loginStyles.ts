import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

// Paleta local, modo claro e escuro
export const cores = {
  light: {
    bgInicio: "#eef2f7",
    bgFim: "#dde6f0",
    cardBg: "#ffffff",
    cardSombra: "rgba(15, 35, 60, 0.12)",
    textoPrincipal: "#16243a",
    textoSecundario: "#5b6b80",
    borda: "#d7dee8",
    acento: "#1f7a5c",
    acentoHover: "#19624a",
    acentoContraste: "#ffffff",
    erro: "#c0392b",
    iconeBotao: "#16243a",
  },
  dark: {
    bgInicio: "#10141c",
    bgFim: "#1a2030",
    cardBg: "#1c2333",
    cardSombra: "rgba(0, 0, 0, 0.45)",
    textoPrincipal: "#f1f4f9",
    textoSecundario: "#9aa6bd",
    borda: "#2e3950",
    acento: "#2ecc91",
    acentoHover: "#27ae84",
    acentoContraste: "#0b1118",
    erro: "#ff6b5e",
    iconeBotao: "#f1f4f9",
  },
};

// Recebe o tema atual e o inset do topo "safe area" e retorna os estilos
export function criarEstilos(tema: "light" | "dark", insetTop: number = 0) {
  const c = cores[tema];

  return StyleSheet.create({
    // Wrappers principais
    host: {
      flex: 1,
      backgroundColor: c.bgInicio,
    },
    loginContent: {
      flexGrow: 1,
    },
    // Layout central
    loginWrapper: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 24,
    },

    // Card
    loginCard: {
      width: "100%",
      maxWidth: width < 360 ? 320 : width < 600 ? 380 : width < 992 ? 420 : 440,
      backgroundColor: c.cardBg,
      borderRadius: width < 360 ? 16 : 20,
      paddingHorizontal: width < 360 ? 20 : width >= 600 ? 40 : 28,
      paddingTop: width < 360 ? 28 : width >= 600 ? 44 : 36,
      paddingBottom: width < 360 ? 26 : width >= 600 ? 38 : 32,
      shadowColor: c.cardSombra,
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 1,
      shadowRadius: 40,
      elevation: 10,
    },

    // Botão de troca de tema, utiliza o inset real do aparelho em vez de valor fixo
    botaoTema: {
      position: "absolute",
      top: insetTop + 12,
      right: 16,
      zIndex: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.cardBg,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: c.cardSombra,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 14,
      elevation: 6,
    },

    // Marca e titulo
    marca: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: height < 480 ? 18 : 28,
    },
    marcaIcone: {
      width: height < 480 ? 48 : width < 360 ? 56 : 64,
      height: height < 480 ? 48 : width < 360 ? 56 : 64,
      borderRadius: 16,
      backgroundColor: c.acento,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: height < 480 ? 8 : 14,
    },
    marcaTitulo: {
      margin: 0,
      fontSize: width < 360 ? 21 : width >= 600 ? 26 : 24,
      fontWeight: "700",
      color: c.textoPrincipal,
      letterSpacing: -0.15,
    },
    marcaSubtitulo: {
      marginTop: 6,
      fontSize: 14,
      color: c.textoSecundario,
      textAlign: "center",
    },

    // Formulário
    formLogin: {
      flexDirection: "column",
    },
    campoUsuario: {
      borderWidth: 1,
      borderColor: c.borda,
      borderRadius: 12,
      paddingHorizontal: 14,
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    campoUsuarioInput: {
      flex: 1,
      color: c.textoPrincipal,
      fontSize: 16,
      paddingVertical: 10,
    },

    // Mensagem de erro
    mensagemErro: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: -4,
    },
    mensagemErroTexto: {
      color: c.erro,
      fontSize: 13,
    },

    // Botão entrar
    botaoEntrar: {
      backgroundColor: c.acento,
      borderRadius: 12,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 6,
    },
    botaoEntrarConteudo: {
      flexDirection: "row",
      alignItems: "center",
    },
    botaoEntrarTexto: {
      color: c.acentoContraste,
      fontWeight: "600",
      fontSize: 16,
    },
  });
}
