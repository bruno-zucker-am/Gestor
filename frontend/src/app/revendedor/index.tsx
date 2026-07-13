import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  criarEstilos,
  cores as coresPaleta,
} from "@src/styles/dashboardStyles";
import { useTema } from "@src/service/temaService";
import { IRevendedorRead, IRevendedorCreate } from "@src/model/revendedorModel";

// Interface conectando os estados e funções que vêm da Dashboard
interface RevendedorProps {
  revendas: IRevendedorRead[];
  mostrarFormRevenda: boolean;
  setMostrarFormRevenda: (mostrar: boolean) => void;
  novaRevenda: IRevendedorCreate;
  setNovaRevenda: (revenda: IRevendedorCreate) => void;
  abrirCalendario: (tipo: "revenda", valorAtual: string) => void;
  salvarRevenda: () => void;
  removerRevenda: (id: number, nome: string) => void; // ID como number
}

// Componente principal para gerenciar revendedores
export default function Revendedor({
  revendas,
  mostrarFormRevenda,
  setMostrarFormRevenda,
  novaRevenda,
  setNovaRevenda,
  abrirCalendario,
  salvarRevenda,
  removerRevenda,
}: RevendedorProps) {
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
          onPress={() => setMostrarFormRevenda(!mostrarFormRevenda)}
        >
          <MaterialCommunityIcons
            name={mostrarFormRevenda ? "minus" : "plus"}
            size={18}
            color={cores.texto}
          />
          <Text style={styles.btnFormHeaderTexto}>
            {mostrarFormRevenda ? "Cancelar" : "Nova Revenda"}
          </Text>
        </TouchableOpacity>

        {mostrarFormRevenda && (
          <View style={styles.formCampos}>
            <View style={styles.campo}>
              <Text style={styles.labelInput}>Nome da revenda</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Revenda Norte"
                placeholderTextColor={cores.texto2}
                value={novaRevenda.nome}
                onChangeText={(t) =>
                  setNovaRevenda({ ...novaRevenda, nome: t })
                }
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.labelInput}>Qtd. logins</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(novaRevenda.quantidadeLogin || "")}
                onChangeText={(t) =>
                  setNovaRevenda({
                    ...novaRevenda,
                    quantidadeLogin: Number(t),
                  })
                }
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.labelInput}>Vencimento</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  abrirCalendario("revenda", novaRevenda.vencimento)
                }
              >
                <Text
                  style={{
                    color: novaRevenda.vencimento ? cores.texto : cores.texto2,
                  }}
                >
                  {novaRevenda.vencimento || "Selecione a data"}
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
                value={novaRevenda.valor ? String(novaRevenda.valor) : ""}
                onChangeText={(t) =>
                  setNovaRevenda({
                    ...novaRevenda,
                    valor: Number(t) || 0,
                  })
                }
              />
            </View>

            <TouchableOpacity style={styles.btnSalvar} onPress={salvarRevenda}>
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

      {/* Lista Vazia */}
      {revendas.length === 0 && (
        <View style={styles.listaVazia}>
          <MaterialCommunityIcons
            name="storefront-outline"
            size={40}
            color={cores.texto2}
            style={{ opacity: 0.4 }}
          />
          <Text style={styles.listaVaziaTexto}>Nenhuma revenda cadastrada</Text>
        </View>
      )}

      {/* Renderização da Lista */}
      {revendas.map((r: IRevendedorRead) => {
        const status = statusVencimento(r.vencimento);
        return (
          <View key={r.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNome}>{r.nome}</Text>
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
                      ? `${diasParaVencer(r.vencimento)}d`
                      : formatarData(r.vencimento)}
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
                  {r.quantidadeLogin} login(s)
                </Text>
              </View>
              <View style={styles.detalheLinha}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={14}
                  color={cores.texto2}
                />
                <Text style={styles.detalheTexto}>
                  {formatarData(r.vencimento)}
                </Text>
              </View>
              <Text style={styles.itemValor}>{formatarMoeda(r.valor)}</Text>
            </View>

            <View style={styles.itemAcoes}>
              <TouchableOpacity
                style={styles.btnRemover}
                onPress={() => removerRevenda(r.id, r.nome)}
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
