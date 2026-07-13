import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Paleta de cores para os temas light e dark
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
    warning: "#f39c12",
    warningBg: "rgba(243, 156, 18, 0.15)",
    sombra: "rgba(15,35,60,0.10)",
    positivo: "#2ecc91",
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
    warning: "#f39c12",
    warningBg: "rgba(243, 156, 18, 0.15)",
    sombra: "rgba(0,0,0,0.35)",
    positivo: "#2ecc91",
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
    // Header e Toolbar, utiliza o inset real do aparelho em vez de valor fixo por plataforma
    header: {
      backgroundColor: c.bg2,
      borderBottomWidth: 1,
      borderBottomColor: c.borda,
      paddingTop: insetTop + 10,
    },
    toolbarInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    toolbarMarca: {
      flexDirection: "row",
      alignItems: "center",
    },
    marcaTexto: {
      fontSize: 16,
      fontWeight: "700",
      color: c.texto,
    },
    toolbarAcoes: {
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

    // Abas (segment)
    segmentContainer: {
      flexDirection: "row",
      backgroundColor: c.card,
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 10,
      padding: 2,
      borderWidth: 1,
      borderColor: c.borda,
    },
    segmentButton: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      borderRadius: 8,
    },
    segmentButtonAtivo: {
      backgroundColor: c.bg2,
    },
    segmentLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: c.texto2,
    },
    segmentLabelAtivo: {
      color: c.texto,
      fontWeight: "700",
    },

    // Conteúdo
    content: {
      flex: 1,
    },
    abaConteudo: {
      padding: 16,
      maxWidth: 640,
      width: "100%",
      alignSelf: "center",
    },

    // Barra de resumo
    saudacao: {
      marginBottom: 4,
    },
    saudacaoTexto: {
      fontSize: 16,
      color: c.texto2,
    },
    saudacaoNome: {
      color: c.texto,
      fontWeight: "700",
    },
    cardSaldo: {
      backgroundColor: c.card,
      borderRadius: 14,
      padding: 18,
      borderWidth: 1,
      borderColor: c.borda,
      alignItems: "center",
    },
    saldoLabel: {
      fontSize: 13,
      color: c.texto2,
      fontWeight: "600",
      textTransform: "uppercase",
      marginBottom: 4,
    },
    saldoValor: {
      fontSize: 26,
      fontWeight: "700",
      color: c.positivo,
    },
    saldoValorNegativo: {
      color: c.danger,
    },
    saldoSublabel: {
      fontSize: 12,
      color: c.texto2,
      marginTop: 4,
    },
    totaisGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 6,
    },
    totalCard: {
      backgroundColor: c.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 12,
      alignItems: "center",
      width: width > 400 ? "31.5%" : "47%",
      flexGrow: 1,
    },
    totalNum: {
      fontSize: 18,
      fontWeight: "700",
      color: c.texto,
    },
    totalLabel: {
      fontSize: 12,
      color: c.texto2,
    },
    totalValor: {
      fontSize: 13,
      fontWeight: "600",
      color: c.texto,
      marginTop: 2,
    },

    // Formulários de Adição
    cardForm: {
      backgroundColor: c.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 12,
    },
    btnFormHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 4,
    },
    btnFormHeaderTexto: {
      fontSize: 14,
      fontWeight: "700",
      color: c.texto,
    },
    formCampos: {
      marginTop: 4,
    },
    campo: {
      backgroundColor: c.bg2,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    labelInput: {
      fontSize: 12,
      color: c.texto2,
      fontWeight: "600",
      marginBottom: 2,
    },
    input: {
      color: c.texto,
      fontSize: 15,
      paddingVertical: 6,
    },
    btnSalvar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.acento,
      paddingVertical: 12,
      borderRadius: 10,
      marginTop: 4,
    },
    btnSalvarTexto: {
      color: c.acentoContraste,
      fontSize: 14,
      fontWeight: "700",
    },

    // Listas e Itens
    listaVazia: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 44,
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
      marginBottom: 2,
    },
    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemNome: {
      fontSize: 15,
      fontWeight: "700",
      color: c.texto,
    },
    badgeStatus: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    badgeStatusTexto: {
      fontSize: 11,
      fontWeight: "700",
    },
    badge_ok: { backgroundColor: c.acentoBg },
    badge_ok_txt: { color: c.acento },
    badge_alerta: { backgroundColor: c.warningBg },
    badge_alerta_txt: { color: c.warning },
    badge_vencido: { backgroundColor: c.dangerBg },
    badge_vencido_txt: { color: c.danger },

    itemDetalhes: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
    },
    detalheLinha: {
      flexDirection: "row",
      alignItems: "center",
    },
    detalheTexto: {
      fontSize: 13,
      color: c.texto2,
    },
    itemValor: {
      fontSize: 14,
      fontWeight: "700",
      color: c.positivo,
      marginLeft: "auto",
    },
    itemValorSaida: {
      color: c.danger,
    },
    itemAcoes: {
      borderTopWidth: 1,
      borderTopColor: c.bg2,
      paddingTop: 10,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    btnRemover: {
      flexDirection: "row",
      alignItems: "center",
    },
    btnRemoverTexto: {
      color: c.danger,
      fontSize: 13,
      fontWeight: "600",
    },
  });
}
