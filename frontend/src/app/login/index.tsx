import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Importações de estilos e serviços
import { LoginService } from "@src/service/loginService";
import { criarEstilos, cores as coresPaleta } from "@src/styles/loginStyles";
import { useTema } from "@src/service/temaService";

// Componente de Login
export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { temaEscuro, alternarTema } = useTema();
  const temaAtual = temaEscuro ? "dark" : "light";
  const cores = coresPaleta[temaAtual];
  const styles = criarEstilos(temaAtual, insets.top);

  // Função para realizar o login
  const entrar = async () => {
    setErro("");

    // Validação de campos
    const usuarioFormatado = usuario.trim();
    const senhaFormatada = senha.trim();

    if (!usuarioFormatado) {
      setErro("Digite seu usuário para continuar.");
      return;
    }

    if (!senhaFormatada) {
      setErro("Digite sua senha para continuar.");
      return;
    }
    // Inicia o processo de login
    setCarregando(true);

    try {
      const resposta = await LoginService.login({
        identificador: usuarioFormatado,
        senha: senhaFormatada,
      });

      // Se o login for bem-sucedido, armazena as informações do usuário e redireciona
      setCarregando(false);

      // Armazenar informações do usuário no AsyncStorage
      await AsyncStorage.setItem("usuarioLogado", resposta.usuario);
      await AsyncStorage.setItem("tipoUsuario", resposta.tipo);
      await AsyncStorage.setItem("usuarioId", resposta.id.toString());

      if (resposta.tipo === "administrador") {
        router.replace("/administrador");
      } else {
        router.replace("/dashboard");
      }
    } catch (err: any) {
      setCarregando(false);
      setSenha(""); // Limpa a senha se der erro para maior segurança
      setErro(err.message || "Não foi possível realizar o login.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.host}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.loginContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginWrapper}>
          <TouchableOpacity
            style={styles.botaoTema}
            onPress={alternarTema}
            accessibilityLabel={
              temaEscuro ? "Mudar para tema claro" : "Mudar para tema escuro"
            }
          >
            <Ionicons
              name={temaEscuro ? "sunny-outline" : "moon-outline"}
              size={22}
              color={cores.iconeBotao}
            />
          </TouchableOpacity>

          <View style={styles.loginCard}>
            <View style={styles.marca}>
              <View style={styles.marcaIcone}>
                <Ionicons
                  name="wallet-outline"
                  size={32}
                  color={cores.acentoContraste}
                />
              </View>
              <Text style={styles.marcaTitulo}>Gestor Financeiro</Text>
              <Text style={styles.marcaSubtitulo}>
                Controle financeiro simples e direto
              </Text>
            </View>

            <View style={styles.formLogin}>
              {/* Campo usuário */}
              <View style={styles.campoUsuario}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={cores.textoSecundario}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.campoUsuarioInput}
                  placeholder="Digite seu usuário"
                  placeholderTextColor={cores.textoSecundario}
                  value={usuario}
                  onChangeText={(text) => {
                    setUsuario(text);
                    setErro("");
                  }}
                  autoCapitalize="none"
                  editable={!carregando}
                />
              </View>

              {/* Campo senha */}
              <View style={[styles.campoUsuario, { marginTop: 12 }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={cores.textoSecundario}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.campoUsuarioInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor={cores.textoSecundario}
                  value={senha}
                  onChangeText={(text) => {
                    setSenha(text);
                    setErro("");
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!carregando}
                />
              </View>

              {erro ? (
                <View style={styles.mensagemErro}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={cores.erro}
                  />
                  <Text style={styles.mensagemErroTexto}>{erro}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.botaoEntrar,
                  {
                    backgroundColor:
                      carregando || !usuario.trim() || !senha.trim()
                        ? cores.borda
                        : cores.acento,
                  },
                ]}
                onPress={entrar}
                disabled={carregando || !usuario.trim() || !senha.trim()}
              >
                {carregando ? (
                  <ActivityIndicator color={cores.acentoContraste} />
                ) : (
                  <View style={styles.botaoEntrarConteudo}>
                    <Ionicons
                      name="log-in-outline"
                      size={20}
                      color={cores.acentoContraste}
                    />
                    <Text style={styles.botaoEntrarTexto}>Entrar</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
