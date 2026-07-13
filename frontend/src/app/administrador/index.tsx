import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTema } from "@src/service/temaService";
import {
  IMasterRead,
  IMasterCreate,
  IMasterUpdate,
} from "@src/model/masterModel";
import {
  criarEstilos,
  cores as coresPaleta,
} from "@src/styles/administradorStyles";
import { MasterService } from "@src/service/masterService";

// Componente principal para gerenciar masters
export default function Administrador() {
  const router = useRouter();
  const { temaEscuro, alternarTema } = useTema();
  const insets = useSafeAreaInsets();

  // Estado da lista de masters
  const [masters, setMasters] = useState<IMasterRead[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Formulario de criação
  const [mostrarFormCriar, setMostrarFormCriar] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  // Formulario de edição
  const [masterEditando, setMasterEditando] = useState<IMasterRead | null>(
    null,
  );
  const [nomeEditando, setNomeEditando] = useState("");

  // Tema e estilos
  const temaAtual = temaEscuro ? "dark" : "light";
  const cores = coresPaleta[temaAtual];
  const styles = criarEstilos(temaAtual, insets.top);

  // Verifica se o usuário está logado ao montar o componente
  useEffect(() => {
    verificarAcesso();
  }, []);

  // Função para verificar se o usuário está logado
  const verificarAcesso = async () => {
    const logado = await AsyncStorage.getItem("usuarioLogado");
    if (!logado) {
      router.replace("/login");
      return;
    }
    // valor de logado usado apenas para controle de acesso
    carregarMasters();
  };

  // Função para sair da sessão
  const sair = () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("usuarioLogado");
          await AsyncStorage.removeItem("tipoUsuario");
          router.replace("/login");
        },
      },
    ]);
  };

  // Função para carregar a lista de masters
  const carregarMasters = async () => {
    setCarregando(true);
    try {
      const lista = await MasterService.buscarMasters();
      // Garante que o estado seja um array, mesmo se o service retornar null
      setMasters(lista || []);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar masters.");
    } finally {
      setCarregando(false);
    }
  };

  // Função para salvar um novo master
  const salvarMaster = async () => {
    const nomeValidado = novoNome.trim().toUpperCase();
    const senhaValidada = novaSenha.trim();

    if (!nomeValidado) {
      Alert.alert("Aviso", "Digite o nome do master.");
      return;
    }
    if (!senhaValidada) {
      Alert.alert("Aviso", "Digite a senha do master.");
      return;
    }

    try {
      const payload: IMasterCreate = {
        usuario: nomeValidado,
        senha: senhaValidada,
      };

      // Chama o service para criar o master
      await MasterService.criarMaster(payload);

      setNovoNome("");
      setNovaSenha("");
      setMostrarFormCriar(false);
      Alert.alert("Sucesso", "Master criado com sucesso!");
      carregarMasters();
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar master.");
    }
  };

  // Funções para iniciar a edição
  const iniciarEdicao = (master: IMasterRead) => {
    setMasterEditando(master);
    setNomeEditando(master.usuario);
  };

  // Funções para cancelar a edição
  const cancelarEdicao = () => {
    setMasterEditando(null);
    setNomeEditando("");
  };

  // Função para salvar a edição
  const salvarEdicao = async () => {
    if (!masterEditando) return;
    const nomeValidado = nomeEditando.trim().toUpperCase();

    if (!nomeValidado) {
      Alert.alert("Aviso", "O nome não pode ser vazio.");
      return;
    }

    try {
      const payload: IMasterUpdate = {
        usuario: nomeValidado,
      };

      await MasterService.atualizarMaster(masterEditando.id, payload);

      setMasters((masters) =>
        masters.map((r) =>
          r.id === masterEditando.id ? { ...r, usuario: nomeValidado } : r,
        ),
      );
      cancelarEdicao();
      Alert.alert("Sucesso", "Master atualizado!");
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar master.");
    }
  };

  // Função para deletar um master
  const deletarMaster = (master: IMasterRead) => {
    Alert.alert("Remover master", `Remover "${master.id}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await MasterService.deletarMaster(master.id);
            setMasters((masters) => masters.filter((r) => r.id !== master.id));
            Alert.alert("Sucesso", "Master removido.");
          } catch (error) {
            Alert.alert("Erro", "Erro ao remover master.");
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
        <View style={styles.headerMarca}>
          <MaterialIcons
            name="account-balance-wallet"
            size={24}
            color={cores.acento}
          />
          <Text style={styles.headerTitulo}>Gestor Financeiro</Text>
          <View style={styles.badgeAdmin}>
            <Text style={styles.badgeAdminTexto}>Admin</Text>
          </View>
        </View>

        <View style={styles.headerAcoes}>
          <TouchableOpacity style={styles.btnIcon} onPress={alternarTema}>
            <MaterialIcons
              name={temaEscuro ? "light-mode" : "dark-mode"}
              size={20}
              color={cores.texto}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnIcon} onPress={sair}>
            <MaterialIcons name="logout" size={20} color={cores.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.conteudoInner}
      >
        {/* Cabeçalho da seção */}
        <View style={styles.secaoHeader}>
          <View style={styles.secaoTituloBox}>
            <MaterialIcons
              name="people-outline"
              size={22}
              color={cores.acento}
            />
            <Text style={styles.secaoTitulo}>Masters</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeTexto}>{masters.length}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnNovo}
            onPress={() => setMostrarFormCriar(!mostrarFormCriar)}
          >
            <MaterialIcons
              name={mostrarFormCriar ? "remove" : "add"}
              size={18}
              color={cores.acentoContraste}
            />
            <Text style={styles.btnNovoTexto}>
              {mostrarFormCriar ? "Cancelar" : "Novo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulário de criação */}
        {mostrarFormCriar && (
          <View style={styles.cardForm}>
            <View style={styles.campo}>
              <TextInput
                style={styles.input}
                placeholder="Ex: MAURO5"
                placeholderTextColor={cores.texto2}
                value={novoNome}
                onChangeText={setNovoNome}
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.campo}>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={cores.texto2}
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity style={styles.btnSalvar} onPress={salvarMaster}>
              <MaterialIcons
                name="check-circle-outline"
                size={18}
                color={cores.acentoContraste}
              />
              <Text style={styles.btnSalvarTexto}>Salvar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Estados de lista */}
        {carregando && (
          <View style={styles.listaVazia}>
            <ActivityIndicator size="large" color={cores.acento} />
            <Text style={styles.listaVaziaTexto}>Carregando...</Text>
          </View>
        )}

        {!carregando && masters.length === 0 && (
          <View style={styles.listaVazia}>
            <MaterialIcons
              name="people-outline"
              size={40}
              color={cores.texto2}
              style={{ opacity: 0.4 }}
            />
            <Text style={styles.listaVaziaTexto}>Nenhum master cadastrado</Text>
          </View>
        )}

        {/* Lista de masters */}
        {masters.map((r) => (
          <View key={r.id} style={styles.itemCard}>
            {/* Visualização padrão */}
            {masterEditando?.id !== r.id && (
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemId}>#{r.id}</Text>
                  <Text style={styles.itemUsuario}>{r.usuario}</Text>
                </View>
                <View style={styles.itemAcoes}>
                  <TouchableOpacity
                    style={[styles.btnAcao, styles.btnAcaoEditar]}
                    onPress={() => iniciarEdicao(r)}
                  >
                    <MaterialIcons name="edit" size={17} color={cores.acento} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnAcao, styles.btnAcaoDeletar]}
                    onPress={() => deletarMaster(r)}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={17}
                      color={cores.danger}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Modo edição */}
            {masterEditando?.id === r.id && (
              <View>
                <View style={styles.campo}>
                  <TextInput
                    style={styles.input}
                    value={nomeEditando}
                    onChangeText={setNomeEditando}
                    autoCapitalize="characters"
                  />
                </View>
                <View style={styles.edicaoAcoes}>
                  <TouchableOpacity
                    style={styles.btnCancelar}
                    onPress={cancelarEdicao}
                  >
                    <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSalvar, styles.btnSalvarSm]}
                    onPress={salvarEdicao}
                  >
                    <MaterialIcons
                      name="check-circle-outline"
                      size={18}
                      color={cores.acentoContraste}
                    />
                    <Text style={styles.btnSalvarTexto}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
