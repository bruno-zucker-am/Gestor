import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTema } from "@src/service/temaService";
import { ResumoModel } from "@src/model/resumoModel";
import {
  criarEstilos,
  cores as coresPaleta,
} from "@src/styles/dashboardStyles";

// Interface para as propriedades do componente Resumo
interface ResumoProps {
  usuarioLogado: string;
  resumo: ResumoModel | null;
  setAbaSelecionada: (
    aba: "resumo" | "revendas" | "clientes" | "fornecedores",
  ) => void;
}

// Componente principal para exibir o resumo financeiro
export default function Resumo({
  usuarioLogado,
  resumo,
  setAbaSelecionada,
}: ResumoProps) {
  const { temaEscuro } = useTema();
  const insets = useSafeAreaInsets();

  const temaAtual = temaEscuro ? "dark" : "light";
  const cores = coresPaleta[temaAtual];
  const styles = criarEstilos(temaAtual, insets.top);

  // Função auxiliar para formatação de moeda
  const formatarMoeda = (valor: number | undefined | null) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor ?? 0);
  };

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.abaConteudo}>
        {/* Saudação */}
        <View style={styles.saudacao}>
          <Text style={styles.saudacaoTexto}>
            Olá, <Text style={styles.saudacaoNome}>{usuarioLogado}</Text>
          </Text>
        </View>

        {/* Card Saldo Líquido */}
        <View style={styles.cardSaldo}>
          <Text style={styles.saldoLabel}>Saldo Líquido</Text>
          <Text
            style={[
              styles.saldoValor,
              (resumo?.saldoLiquido ?? 0) < 0 && styles.saldoValorNegativo,
            ]}
          >
            {formatarMoeda(resumo?.saldoLiquido)}
          </Text>
          <Text style={styles.saldoSublabel}>receitas − fornecedores</Text>
        </View>

        {/* Grid de Totais */}
        <View style={styles.totaisGrid}>
          {/* Card Revendas */}
          <TouchableOpacity
            style={styles.totalCard}
            onPress={() => setAbaSelecionada("revendas")}
          >
            <MaterialCommunityIcons
              name="storefront-outline"
              size={20}
              color={cores.acento}
            />
            <Text style={styles.totalNum}>{resumo?.totalRevendas ?? 0}</Text>
            <Text style={styles.totalLabel}>Revendas</Text>
            <Text style={styles.totalValor}>
              {formatarMoeda(resumo?.receitaRevendas)}
            </Text>
          </TouchableOpacity>

          {/* Card Clientes */}
          <TouchableOpacity
            style={styles.totalCard}
            onPress={() => setAbaSelecionada("clientes")}
          >
            <MaterialCommunityIcons
              name="account-group-outline"
              size={20}
              color={cores.acento}
            />
            <Text style={styles.totalNum}>{resumo?.totalClientes ?? 0}</Text>
            <Text style={styles.totalLabel}>Clientes</Text>
            <Text style={styles.totalValor}>
              {formatarMoeda(resumo?.receitaClientes)}
            </Text>
          </TouchableOpacity>

          {/* Card Fornecedores */}
          <TouchableOpacity
            style={styles.totalCard}
            onPress={() => setAbaSelecionada("fornecedores")}
          >
            <MaterialCommunityIcons
              name="cart-outline"
              size={20}
              color={cores.danger}
            />
            <Text style={styles.totalNum}>
              {resumo?.totalFornecedores ?? 0}
            </Text>
            <Text style={styles.totalLabel}>Fornec.</Text>
            <Text style={styles.totalValor}>
              {formatarMoeda(resumo?.totalAPagar)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
