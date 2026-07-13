import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  criarEstilos,
  cores as coresPaleta,
} from "@src/styles/dashboardStyles";
import { useTema } from "@src/service/temaService";
import { IClienteRead, IClienteCreate } from "@src/model/clienteModel";

// Interface conectando os estados e funções que vêm da Dashboard
interface ClienteProps {
  clientes: IClienteRead[];
  mostrarFormCliente: boolean;
  setMostrarFormCliente: (mostrar: boolean) => void;
  novoCliente: IClienteCreate;
  setNovoCliente: (cliente: IClienteCreate) => void;
  abrirCalendario: (tipo: "cliente", valorAtual: string) => void;
  salvarCliente: () => void;
  removerCliente: (id: number, nome: string) => void;
}

// Componente principal para gerenciar clientes
export default function Cliente({
  clientes,
  mostrarFormCliente,
  setMostrarFormCliente,
  novoCliente,
  setNovoCliente,
  abrirCalendario,
  salvarCliente,
  removerCliente,
}: ClienteProps) {
  const { temaEscuro } = useTema();
  const insets = useSafeAreaInsets();
  const temaAtual = temaEscuro ? "dark" : "light";
  const cores = coresPaleta[temaAtual];
  const styles = criarEstilos(temaAtual, insets.top);

  // Formatação de moeda
  const formatarMoeda = (valor: number | undefined) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor ?? 0);
  };

  // Formatação de data
  const formatarDataParaExibicao = (valor: string): string => {
    if (!valor) return "—";

    const isoMatch = valor.match(/^(\d{4}-\d{2}-\d{2})(?:[T ].*)?$/);
    if (isoMatch) {
      const [y, m, d] = isoMatch[1].split("-").map(Number);
      return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      return valor;
    }

    return valor;
  };

  // Função para converter datas para o formato ISO
  const converterDataParaIso = (valor: string): string => {
    const isoMatch = valor.match(/^(\d{4}-\d{2}-\d{2})(?:[T ].*)?$/);
    if (isoMatch) return isoMatch[1];

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      const [dia, mes, ano] = valor.split("/").map(Number);
      return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    }

    return "";
  };

  // Função para calcular os dias restantes até o vencimento
  const diasParaVencer = (valor: string): number => {
    if (!valor) return 0;
    const iso = converterDataParaIso(valor);
    if (!iso) return 0;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const venc = new Date(`${iso}T00:00:00`);
    return Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
  };

  // Função para formatar a data para exibição
  const formatarData = (valor: string): string =>
    formatarDataParaExibicao(valor);

  // Função para determinar o status do vencimento
  const statusVencimento = (iso: string): "ok" | "alerta" | "vencido" => {
    const dias = diasParaVencer(iso);
    if (dias < 0) return "vencido";
    if (dias <= 7) return "alerta";
    return "ok";
  };

  return (
    <View style={styles.abaConteudo}>
      {/* Card do formulário */}
      <View style={styles.cardForm}>
        <TouchableOpacity
          style={styles.btnFormHeader}
          onPress={() => setMostrarFormCliente(!mostrarFormCliente)}
        >
          <MaterialCommunityIcons
            name={mostrarFormCliente ? "minus" : "plus"}
            size={18}
            color={cores.texto}
          />
          <Text style={styles.btnFormHeaderTexto}>
            {mostrarFormCliente ? "Cancelar" : "Novo Cliente"}
          </Text>
        </TouchableOpacity>

        {mostrarFormCliente && (
          <View style={styles.formCampos}>
            <View style={styles.campo}>
              <Text style={styles.labelInput}>Nome do cliente</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: João Silva"
                placeholderTextColor={cores.texto2}
                value={novoCliente.nome}
                onChangeText={(t) =>
                  setNovoCliente({ ...novoCliente, nome: t })
                }
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.labelInput}>Qtd. acessos</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(novoCliente.quantidadeAcesso || "")}
                onChangeText={(t) =>
                  setNovoCliente({
                    ...novoCliente,
                    quantidadeAcesso: Number(t),
                  })
                }
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.labelInput}>Vencimento</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  abrirCalendario("cliente", novoCliente.vencimento)
                }
              >
                <Text
                  style={{
                    color: novoCliente.vencimento ? cores.texto : cores.texto2,
                  }}
                >
                  {novoCliente.vencimento || "Selecione a data"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.campo}>
              <Text style={styles.labelInput}>Valor (R$)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={cores.texto2}
                value={novoCliente.valor ? String(novoCliente.valor) : ""}
                onChangeText={(t) =>
                  setNovoCliente({
                    ...novoCliente,
                    valor: Number(t) || 0,
                  })
                }
              />
            </View>

            <TouchableOpacity style={styles.btnSalvar} onPress={salvarCliente}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={18}
                color={cores.acentoContraste}
              />
              <Text style={styles.btnSalvarTexto}>Salvar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Lista de clientes */}
      {clientes.length === 0 && (
        <View style={styles.listaVazia}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={40}
            color={cores.texto2}
            style={{ opacity: 0.4 }}
          />
          <Text style={styles.listaVaziaTexto}>Nenhum cliente cadastrado</Text>
        </View>
      )}

      {clientes.map((c) => {
        const status = statusVencimento(c.vencimento);
        return (
          <View key={c.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNome}>{c.nome}</Text>
              <View
                style={[styles.badgeStatus, styles[`badge_${status}` as const]]}
              >
                <Text
                  style={[
                    styles.badgeStatusTexto,
                    styles[`badge_${status}_txt` as const],
                  ]}
                >
                  {status === "vencido"
                    ? "Vencido"
                    : status === "alerta"
                      ? `${diasParaVencer(c.vencimento)}d`
                      : formatarData(c.vencimento)}
                </Text>
              </View>
            </View>

            <View style={styles.itemDetalhes}>
              <View style={styles.detalheLinha}>
                <MaterialCommunityIcons
                  name="layers-outline"
                  size={14}
                  color={cores.texto2}
                />
                <Text style={styles.detalheTexto}>
                  {c.quantidadeAcesso} acesso(s)
                </Text>
              </View>
              <View style={styles.detalheLinha}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={14}
                  color={cores.texto2}
                />
                <Text style={styles.detalheTexto}>
                  {formatarData(c.vencimento)}
                </Text>
              </View>
              <Text style={styles.itemValor}>{formatarMoeda(c.valor)}</Text>
            </View>

            <View style={styles.itemAcoes}>
              <TouchableOpacity
                style={styles.btnRemover}
                onPress={() => removerCliente(c.id, c.nome)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={16}
                  color={cores.danger}
                />
                <Text style={styles.btnRemoverTexto}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}
