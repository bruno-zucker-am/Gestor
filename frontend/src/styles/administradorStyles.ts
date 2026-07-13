import { StyleSheet } from "react-native";

// Paleta de cores
export const cores = {
  light: {
    bg: "#eef2f7",
    bg2: "#e2e9f2",
    card: "#ffffff",
    card2: "#f5f8fc",
    borda: "#d0dae8",
    texto: "#16243a",
    texto2: "#5b6b80",
    acento: "#1f7a5c",
    acentoBg: "rgba(31, 122, 92, 0.15)",
    acentoContraste: "#ffffff",
    danger: "#e74c3c",
    dangerBg: "rgba(231, 76, 60, 0.12)",
    sombra: "rgba(15,35,60,0.10)",
  },
  dark: {
    bg: "#10141c",
    bg2: "#161b27",
    card: "#1c2333",
    card2: "#222840",
    borda: "#2e3950",
    texto: "#f1f4f9",
    texto2: "#9aa6bd",
    acento: "#2ecc91",
    acentoBg: "rgba(46, 204, 145, 0.15)",
    acentoContraste: "#0b1118",
    danger: "#e74c3c",
    dangerBg: "rgba(231, 76, 60, 0.12)",
    sombra: "rgba(0,0,0,0.35)",
  },
};

// Recebe o tema atual e o inset do topo "safe area" e retorna os estilos
export function criarEstilos(tema: "light" | "dark", insetTop: number = 0) {
  const c = cores[tema];

  return StyleSheet.create({
    host: {
      flex: 1,
      backgroundColor: c.bg,
    },
    // Header, utiliza o inset real do aparelho em vez de valor fixo por plataforma
    header: {
      backgroundColor: c.bg2,
      borderBottomWidth: 1,
      borderBottomColor: c.borda,
      paddingTop: insetTop + 10,
      paddingBottom: 10,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerMarca: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerTitulo: {
      fontSize: 16,
      fontWeight: "700",
      color: c.texto,
    },
    badgeAdmin: {
      backgroundColor: c.acentoBg,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 20,
    },
    badgeAdminTexto: {
      fontSize: 10,
      fontWeight: "700",
      color: c.acento,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    headerAcoes: {
      flexDirection: "row",
    },
    btnIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: c.card,
      alignItems: "center",
      justifyContent: "center",
    },

    // Conteúdo
    content: {
      flex: 1,
    },
    conteudoInner: {
      paddingHorizontal: 14,
      paddingTop: 16,
      paddingBottom: 80,
      maxWidth: 640,
      alignSelf: "center",
      width: "100%",
    },

    // Cabeçalho da Seção
    secaoHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    secaoTituloBox: {
      flexDirection: "row",
      alignItems: "center",
    },
    secaoTitulo: {
      fontSize: 18,
      fontWeight: "700",
      color: c.texto,
    },
    totalBadge: {
      backgroundColor: c.acentoBg,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 20,
    },
    totalBadgeTexto: {
      fontSize: 12,
      fontWeight: "700",
      color: c.acento,
    },
    btnNovo: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.acento,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },
    btnNovoTexto: {
      color: c.acentoContraste,
      fontSize: 14,
      fontWeight: "700",
    },

    // Formulário
    cardForm: {
      backgroundColor: c.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 12,
    },
    campo: {
      backgroundColor: c.bg2,
      borderRadius: 10,
      minHeight: 48,
      paddingHorizontal: 12,
      justifyContent: "center",
    },
    input: {
      color: c.texto,
      fontSize: 16,
      paddingVertical: 10,
    },
    btnSalvar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: c.acento,
      paddingVertical: 12,
      borderRadius: 10,
    },
    btnSalvarTexto: {
      color: c.acentoContraste,
      fontSize: 14,
      fontWeight: "700",
    },
    btnSalvarSm: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    // Lista
    listaVazia: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    listaVaziaTexto: {
      color: c.texto2,
      fontSize: 14,
    },
    itemCard: {
      backgroundColor: c.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 14,
      marginBottom: 10,
    },
    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    itemId: {
      fontSize: 12,
      color: c.texto2,
      fontWeight: "600",
    },
    itemUsuario: {
      fontSize: 15,
      fontWeight: "700",
      color: c.texto,
    },
    itemAcoes: {
      flexDirection: "row",
    },
    btnAcao: {
      width: 34,
      height: 34,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    btnAcaoEditar: {
      backgroundColor: c.acentoBg,
    },
    btnAcaoDeletar: {
      backgroundColor: c.dangerBg,
    },
    edicaoAcoes: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },
    btnCancelar: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: c.borda,
      borderRadius: 10,
      justifyContent: "center",
    },
    btnCancelarTexto: {
      color: c.texto2,
      fontSize: 13,
      fontWeight: "600",
    },
  });
}
