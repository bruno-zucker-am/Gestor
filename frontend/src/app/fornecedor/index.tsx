import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  criarEstilos,
  cores as coresPaleta,
} from "@src/styles/dashboardStyles";
import { useTema } from "@src/service/temaService";
import { IFornecedorRead, IFornecedorCreate } from "@src/model/fornecedorModel";

// Interface conectando os estados e funções que vêm da Dashboard
interface FornecedorProps {
  fornecedores: IFornecedorRead[];
  mostrarFormFornecedor: boolean;
  setMostrarFormFornecedor: (mostrar: boolean) => void;
  novoFornecedor: IFornecedorCreate;
  setNovoFornecedor: (fornecedor: IFornecedorCreate) => void;
  abrirCalendario: (tipo: "fornecedor", valorAtual: string) => void;
  salvarFornecedor: () => void;
  removerFornecedor: (id: number, nome: string) => void; // ID alterado para number
}

// Componente principal para gerenciar fornecedores
export default function Fornecedor({
  fornecedores,
  mostrarFormFornecedor,
  setMostrarFormFornecedor,
  novoFornecedor,
  setNovoFornecedor,
  abrirCalendario,
  salvarFornecedor,
  removerFornecedor,
}: FornecedorProps) {
  const { temaEscuro } = useTema();
  const insets = useSafeAreaInsets();

  const temaAtual = temaEscuro ? "dark" : "light";
  const cores = coresPaleta[temaAtual];
  const styles = criarEstilos(temaAtual, insets.top);

  const formatarMoeda = (valor: number | undefined) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor ?? 0);
  };

  // Função para formatar datas para exibição
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
      {/* Card do Formulário */}
      <View style={styles.cardForm}>
        <TouchableOpacity
          style={styles.btnFormHeader}
          onPress={() => setMostrarFormFornecedor(!mostrarFormFornecedor)}
        >
          <MaterialCommunityIcons
            name={mostrarFormFornecedor ? "minus" : "plus"}
            size={18}
            color={cores.texto}
          />
          <Text style={styles.btnFormHeaderTexto}>
            {mostrarFormFornecedor ? "Cancelar" : "Novo Fornecedor"}
          </Text>
        </TouchableOpacity>

        {mostrarFormFornecedor && (
          <View style={styles.formCampos}>
            <View style={styles.campo}>
              <Text style={styles.labelInput}>Nome do fornecedor</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Provedor XYZ"
                placeholderTextColor={cores.texto2}
                value={novoFornecedor.nome}
                onChangeText={(t) =>
                  setNovoFornecedor({ ...novoFornecedor, nome: t })
                }
              />
            </View>
            <View style={styles.campo}>
              <Text style={styles.labelInput}>Tipo de serviço</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Streaming, VPS..."
                placeholderTextColor={cores.texto2}
                value={novoFornecedor.tipoServico}
                onChangeText={(t) =>
                  setNovoFornecedor({ ...novoFornecedor, tipoServico: t })
                }
              />
            </View>
            <View style={styles.campo}>
              <Text style={styles.labelInput}>Vencimento</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  abrirCalendario("fornecedor", novoFornecedor.vencimento)
                }
              >
                <Text
                  style={{
                    color: novoFornecedor.vencimento
                      ? cores.texto
                      : cores.texto2,
                  }}
                >
                  {novoFornecedor.vencimento || "Selecione a data"}
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
                value={novoFornecedor.valor ? String(novoFornecedor.valor) : ""}
                onChangeText={(t) =>
                  setNovoFornecedor({
                    ...novoFornecedor,
                    valor: Number(t) || 0,
                  })
                }
              />
            </View>
            <TouchableOpacity
              style={styles.btnSalvar}
              onPress={salvarFornecedor}
            >
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

      {/* Lista de Fornecedores */}
      {fornecedores.map((f: IFornecedorRead) => {
        const status = statusVencimento(f.vencimento);
        return (
          <View key={f.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNome}>{f.nome}</Text>
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
                      ? `${diasParaVencer(f.vencimento)}d`
                      : formatarData(f.vencimento)}
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
                <Text style={styles.detalheTexto}>{f.tipoServico || "—"}</Text>
              </View>
              <View style={styles.detalheLinha}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={14}
                  color={cores.texto2}
                />
                <Text style={styles.detalheTexto}>
                  {formatarData(f.vencimento)}
                </Text>
              </View>
              <Text style={[styles.itemValor, styles.itemValorSaida]}>
                {formatarMoeda(f.valor)}
              </Text>
            </View>
            <View style={styles.itemAcoes}>
              <TouchableOpacity
                style={styles.btnRemover}
                onPress={() => removerFornecedor(f.id, f.nome)}
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
