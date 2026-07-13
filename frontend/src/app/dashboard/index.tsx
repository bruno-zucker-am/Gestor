import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Services para comunicação com o Backend
import { RevendedorService } from "@src/service/revendedorService";
import { ClienteService } from "@src/service/clienteService";
import { FornecedorService } from "@src/service/fornecedorService";

// Models para tipagem dos dados
import { IRevendedorRead, IRevendedorCreate } from "@src/model/revendedorModel";
import { IClienteRead, IClienteCreate } from "@src/model/clienteModel";
import { IFornecedorRead, IFornecedorCreate } from "@src/model/fornecedorModel";
import { ResumoModel } from "@src/model/resumoModel";

// Estilos e tema
import { useTema } from "@src/service/temaService";
import {
  criarEstilos,
  cores as coresPaleta,
} from "@src/styles/dashboardStyles";
import Resumo from "@/resumo";
import Revendedor from "@/revendedor";
import Cliente from "@/cliente";
import Fornecedor from "@/fornecedor";

// Tipos de abas do dashboard
type Aba = "resumo" | "revendas" | "clientes" | "fornecedores";

// Função para calcular quantos dias faltam para o vencimento
export default function Dashboard() {
  const router = useRouter();
  // Hooks de tema e insets
  const { temaEscuro, alternarTema } = useTema();
  const insets = useSafeAreaInsets();
  const [abaSelecionada, setAbaSelecionada] = useState<Aba>("resumo");
  const [usuarioLogado, setUsuarioLogado] = useState("");
  const [_carregando, setCarregando] = useState(true);

  // States para armazenar os dados vindos do Backend
  const [revendas, setRevendas] = useState<IRevendedorRead[]>([]);
  const [clientes, setClientes] = useState<IClienteRead[]>([]);
  const [fornecedores, setFornecedores] = useState<IFornecedorRead[]>([]);

  // Toggles de formulários
  const [mostrarFormRevenda, setMostrarFormRevenda] = useState(false);
  const [mostrarFormCliente, setMostrarFormCliente] = useState(false);
  const [mostrarFormFornecedor, setMostrarFormFornecedor] = useState(false);
  const [mostrarModalData, setMostrarModalData] = useState(false);
  const [campoDataAtiva, setCampoDataAtiva] = useState<
    "revenda" | "cliente" | "fornecedor" | null
  >(null);
  const [diaSelecionado, setDiaSelecionado] = useState(new Date().getDate());
  const [mesSelecionado, setMesSelecionado] = useState(
    new Date().getMonth() + 1,
  );
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear(),
  );

  // States para armazenar os dados dos novos itens a serem criados
  const [novaRevenda, setNovaRevenda] = useState<IRevendedorCreate>({
    nome: "",
    quantidadeLogin: 1,
    vencimento: "",
    valor: 0,
  });
  const [novoCliente, setNovoCliente] = useState<IClienteCreate>({
    nome: "",
    quantidadeAcesso: 1,
    vencimento: "",
    valor: 0,
  });
  const [novoFornecedor, setNovoFornecedor] = useState<IFornecedorCreate>({
    nome: "",
    tipoServico: "",
    vencimento: "",
    valor: 0,
  });

  // Estilos e cores baseados no tema atual
  const temaAtual = temaEscuro ? "dark" : "light";
  const cores = coresPaleta[temaAtual];
  const styles = criarEstilos(temaAtual, insets.top);

  // Função para calcular o resumo financeiro com base nos dados atuais
  const calcularResumo = (
    revendasAtuais: IRevendedorRead[],
    clientesAtuais: IClienteRead[],
    fornecedoresAtuais: IFornecedorRead[],
  ): ResumoModel => {
    const receitaRevendas = revendasAtuais.reduce(
      (soma, r) => soma + (r.valor ?? 0),
      0,
    );
    const receitaClientes = clientesAtuais.reduce(
      (soma, c) => soma + (c.valor ?? 0),
      0,
    );
    const totalAPagar = fornecedoresAtuais.reduce(
      (soma, f) => soma + (f.valor ?? 0),
      0,
    );

    return {
      totalRevendas: revendasAtuais.length,
      totalClientes: clientesAtuais.length,
      totalFornecedores: fornecedoresAtuais.length,
      receitaRevendas,
      receitaClientes,
      totalAPagar,
      saldoLiquido: receitaRevendas + receitaClientes - totalAPagar,
    };
  };

  // Calcula o resumo financeiro sempre que os dados de revendas, clientes ou fornecedores mudarem
  const resumo = calcularResumo(revendas, clientes, fornecedores);

  // Função para carregar todos os dados do Backend (revendas, clientes e fornecedores)
  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [revendasApi, clientesApi, fornecedoresApi] = await Promise.all([
        RevendedorService.buscarRevendedores(),
        ClienteService.buscarClientes(),
        FornecedorService.buscarFornecedores(),
      ]);

      setRevendas(revendasApi ?? []);
      setClientes(clientesApi ?? []);
      setFornecedores(fornecedoresApi ?? []);
    } catch {
      Alert.alert(
        "Aviso",
        "Não foi possível carregar todos os dados do servidor. Verifique sua conexão.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  // useEffect para verificar a sessão do usuário e carregar os dados ao montar o componente
  useEffect(() => {
    const verificarSessao = async () => {
      const user = await AsyncStorage.getItem("usuarioLogado");
      if (!user) {
        router.replace("/login");
        return;
      }
      setUsuarioLogado(user);
      await carregarDados();
    };
    verificarSessao();
  }, [carregarDados]);

  const sair = () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("usuarioLogado");
          router.replace("/login");
        },
      },
    ]);
  };

  // Função para calcular quantos dias faltam para o vencimento
  const parseDataParaDate = (valor: string): Date => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [y, m, d] = valor.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      const [d, m, y] = valor.split("/").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  };

  // Funções para formatação de valores monetários e datas
  const abrirCalendario = (
    tipo: "revenda" | "cliente" | "fornecedor",
    valorAtual: string,
  ) => {
    setCampoDataAtiva(tipo);
    const data = parseDataParaDate(valorAtual);
    setDiaSelecionado(data.getDate());
    setMesSelecionado(data.getMonth() + 1);
    setAnoSelecionado(data.getFullYear());
    setMostrarModalData(true);
  };

  // Função para confirmar a data selecionada no modal
  const confirmarDataSelecionada = () => {
    const valor = `${anoSelecionado}-${String(mesSelecionado).padStart(2, "0")}-${String(diaSelecionado).padStart(2, "0")}`;

    if (campoDataAtiva === "revenda") {
      setNovaRevenda({ ...novaRevenda, vencimento: valor });
    } else if (campoDataAtiva === "cliente") {
      setNovoCliente({ ...novoCliente, vencimento: valor });
    } else if (campoDataAtiva === "fornecedor") {
      setNovoFornecedor({ ...novoFornecedor, vencimento: valor });
    }

    setMostrarModalData(false);
  };

  // Função para salvar revenda
  const salvarRevenda = async () => {
    if (!novaRevenda.nome.trim() || !novaRevenda.vencimento) {
      Alert.alert("Erro", "Preencha nome e vencimento.");
      return;
    }
    try {
      await RevendedorService.criarRevendedor(novaRevenda);
      await carregarDados();
      setNovaRevenda({
        nome: "",
        quantidadeLogin: 1,
        vencimento: "",
        valor: 0,
      });
      setMostrarFormRevenda(false);
      Alert.alert("Sucesso", "Revenda adicionada!");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a revenda.");
    }
  };

  // Função para remover revenda
  const removerRevenda = (id: number, nome: string) => {
    Alert.alert("Remover revenda", `Remover "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await RevendedorService.deletarRevendedor(id);
            await carregarDados();
            Alert.alert("Sucesso", "Revenda removida.");
          } catch {
            Alert.alert("Erro", "Não foi possível remover a revenda.");
          }
        },
      },
    ]);
  };

  // Função para salvar cliente
  const salvarCliente = async () => {
    if (!novoCliente.nome.trim() || !novoCliente.vencimento) {
      Alert.alert("Erro", "Preencha nome e vencimento.");
      return;
    }
    try {
      await ClienteService.criarCliente(novoCliente);
      await carregarDados();
      setNovoCliente({
        nome: "",
        quantidadeAcesso: 1,
        vencimento: "",
        valor: 0,
      });
      setMostrarFormCliente(false);
      Alert.alert("Sucesso", "Cliente adicionado!");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o cliente.");
    }
  };

  // Função para remover cliente
  const removerCliente = (id: number, nome: string) => {
    Alert.alert("Remover cliente", `Remover "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await ClienteService.deletarCliente(id);
            await carregarDados();
            Alert.alert("Sucesso", "Cliente removido.");
          } catch {
            Alert.alert("Erro", "Não foi possível remover o cliente.");
          }
        },
      },
    ]);
  };

  // Função para salvar fornecedor
  const salvarFornecedor = async () => {
    if (!novoFornecedor.nome.trim() || !novoFornecedor.vencimento) {
      Alert.alert("Erro", "Preencha nome e vencimento.");
      return;
    }
    try {
      await FornecedorService.criarFornecedor(novoFornecedor);
      await carregarDados();
      setNovoFornecedor({
        nome: "",
        tipoServico: "",
        vencimento: "",
        valor: 0,
      });
      setMostrarFormFornecedor(false);
      Alert.alert("Sucesso", "Fornecedor adicionado!");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o fornecedor.");
    }
  };

  // Função para remover fornecedor
  const removerFornecedor = (id: number, nome: string) => {
    Alert.alert("Remover fornecedor", `Remover "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await FornecedorService.deletarFornecedor(id);
            await carregarDados();
            Alert.alert("Sucesso", "Fornecedor removido.");
          } catch {
            Alert.alert("Erro", "Não foi possível remover o fornecedor.");
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.host}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.toolbarInner}>
          <View style={styles.toolbarMarca}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={24}
              color={cores.acento}
            />
            <Text style={styles.marcaTexto}>Gestor Financeiro</Text>
          </View>
          <View style={styles.toolbarAcoes}>
            <TouchableOpacity style={styles.btnIcon} onPress={alternarTema}>
              <MaterialCommunityIcons
                name={temaEscuro ? "white-balance-sunny" : "weather-night"}
                size={20}
                color={cores.texto}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnIcon} onPress={sair}>
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color={cores.danger}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Controles de Aba e Segmento */}
        <View style={styles.segmentContainer}>
          {(["resumo", "revendas", "clientes", "fornecedores"] as Aba[]).map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.segmentButton,
                  abaSelecionada === tab && styles.segmentButtonAtivo,
                ]}
                onPress={() => setAbaSelecionada(tab)}
              >
                <MaterialCommunityIcons
                  name={
                    tab === "resumo"
                      ? "layers-outline"
                      : tab === "revendas"
                        ? "storefront-outline"
                        : tab === "clientes"
                          ? "account-group-outline"
                          : "cart-outline"
                  }
                  size={18}
                  color={abaSelecionada === tab ? cores.texto : cores.texto2}
                />
                <Text
                  style={[
                    styles.segmentLabel,
                    abaSelecionada === tab && styles.segmentLabelAtivo,
                  ]}
                >
                  {tab === "fornecedores"
                    ? "Fornec."
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>

      {/* Conteúdo por aba */}
      {abaSelecionada === "resumo" && (
        <Resumo
          usuarioLogado={usuarioLogado}
          resumo={resumo}
          setAbaSelecionada={setAbaSelecionada}
        />
      )}

      {abaSelecionada === "revendas" && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Revendedor
            revendas={revendas}
            mostrarFormRevenda={mostrarFormRevenda}
            setMostrarFormRevenda={setMostrarFormRevenda}
            novaRevenda={novaRevenda}
            setNovaRevenda={setNovaRevenda}
            abrirCalendario={abrirCalendario}
            salvarRevenda={salvarRevenda}
            removerRevenda={removerRevenda}
          />
        </ScrollView>
      )}

      {abaSelecionada === "clientes" && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Cliente
            clientes={clientes}
            mostrarFormCliente={mostrarFormCliente}
            setMostrarFormCliente={setMostrarFormCliente}
            novoCliente={novoCliente}
            setNovoCliente={setNovoCliente}
            abrirCalendario={abrirCalendario}
            salvarCliente={salvarCliente}
            removerCliente={removerCliente}
          />
        </ScrollView>
      )}

      {abaSelecionada === "fornecedores" && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Fornecedor
            fornecedores={fornecedores}
            mostrarFormFornecedor={mostrarFormFornecedor}
            setMostrarFormFornecedor={setMostrarFormFornecedor}
            novoFornecedor={novoFornecedor}
            setNovoFornecedor={setNovoFornecedor}
            abrirCalendario={abrirCalendario}
            salvarFornecedor={salvarFornecedor}
            removerFornecedor={removerFornecedor}
          />
        </ScrollView>
      )}

      {/* Modal de Calendário: única instância, compartilhada por todas as abas */}
      <Modal visible={mostrarModalData} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        >
          <View
            style={{
              width: "92%",
              maxWidth: 420,
              backgroundColor: cores.card,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{ color: cores.texto, fontSize: 18, fontWeight: "700" }}
            >
              Escolher vencimento
            </Text>
            <Text
              style={{ color: cores.texto2, marginTop: 6, marginBottom: 12 }}
            >
              Selecione dia, mês e ano.
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: cores.texto2, marginBottom: 6 }}>Dia</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Array.from({ length: 31 }, (_, index) => index + 1).map(
                  (dia) => (
                    <TouchableOpacity
                      key={dia}
                      onPress={() => setDiaSelecionado(dia)}
                      style={{
                        marginRight: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor:
                          dia === diaSelecionado ? cores.acento : cores.bg2,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            dia === diaSelecionado
                              ? cores.acentoContraste
                              : cores.texto,
                        }}
                      >
                        {String(dia).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: cores.texto2, marginBottom: 6 }}>Mês</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (mes) => (
                    <TouchableOpacity
                      key={mes}
                      onPress={() => setMesSelecionado(mes)}
                      style={{
                        marginRight: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor:
                          mes === mesSelecionado ? cores.acento : cores.bg2,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            mes === mesSelecionado
                              ? cores.acentoContraste
                              : cores.texto,
                        }}
                      >
                        {String(mes).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: cores.texto2, marginBottom: 6 }}>Ano</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Array.from(
                  { length: 15 },
                  (_, index) => new Date().getFullYear() - 7 + index,
                ).map((ano) => (
                  <TouchableOpacity
                    key={ano}
                    onPress={() => setAnoSelecionado(ano)}
                    style={{
                      marginRight: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor:
                        ano === anoSelecionado ? cores.acento : cores.bg2,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          ano === anoSelecionado
                            ? cores.acentoContraste
                            : cores.texto,
                      }}
                    >
                      {ano}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setMostrarModalData(false)}
                style={{ paddingHorizontal: 12, paddingVertical: 10 }}
              >
                <Text style={{ color: cores.texto2, fontWeight: "600" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmarDataSelecionada}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: cores.acento,
                }}
              >
                <Text
                  style={{
                    color: cores.acentoContraste,
                    fontWeight: "700",
                  }}
                >
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
