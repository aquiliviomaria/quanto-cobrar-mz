import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { CustomButton } from '../../components/common/CustomButton';
import { useOrcamentosStore } from '../../store/useOrcamentosStore';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { calcularMargens } from '../../services/calculadora.service';

export function ResultadoOrcamentoScreen({ navigation, route }: any) {
  const { resultado, produto, quantidade, margem, clienteNome } = route.params;
  const { create } = useOrcamentosStore();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const margens = calcularMargens(resultado.custo_total);

  const guardar = async () => {
    setSaving(true);
    try {
      await create({
        cliente_nome: clienteNome || undefined,
        produto_id: produto.id,
        quantidade,
        margem_aplicada: margem,
        custo_total: resultado.custo_total,
        valor_lucro: resultado.valor_lucro,
        preco_sugerido: resultado.preco_sugerido,
        preco_arredondado: resultado.preco_arredondado,
        status: 'pendente',
      });
      setSaved(true);
      Alert.alert('Guardado!', 'Orçamento guardado no histórico.');
    } finally {
      setSaving(false);
    }
  };

  const partilhar = async () => {
    const msg = `Olá${clienteNome ? ` ${clienteNome}` : ''}! 👋\n\n` +
      `O orçamento para *${produto.nome}* (x${quantidade}) ficou em:\n\n` +
      `💰 *${formatMT(resultado.preco_arredondado)}*\n\n` +
      `Obrigado pela preferência! 🙏`;
    await Share.share({ message: msg });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Resultado" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Produto info */}
        <View style={styles.produtoCard}>
          <Text style={styles.produtoNome}>{produto.nome}</Text>
          <Text style={styles.produtoSub}>Quantidade: {quantidade} · Margem: {margem}%</Text>
          {clienteNome ? <Text style={styles.produtoSub}>Cliente: {clienteNome}</Text> : null}
        </View>

        {/* Resultado principal */}
        <View style={styles.resultadoCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Custo total</Text>
            <Text style={styles.resultVal}>{formatMT(resultado.custo_total)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Lucro ({margem}%)</Text>
            <Text style={[styles.resultVal, { color: colors.success }]}>{formatMT(resultado.valor_lucro)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Preço sugerido</Text>
            <Text style={styles.resultVal}>{formatMT(resultado.preco_sugerido)}</Text>
          </View>
          <View style={[styles.resultRow, styles.destaque]}>
            <Text style={styles.destaqueLabel}>Preço recomendado</Text>
            <Text style={styles.destaqueVal}>{formatMT(resultado.preco_arredondado)}</Text>
          </View>
        </View>

        {/* Comparação de margens */}
        <Text style={styles.sectionTitle}>Comparação de margens</Text>
        <View style={styles.margensCard}>
          {Object.entries(margens).map(([key, val]) => (
            <View key={key} style={styles.margemRow}>
              <Text style={styles.margemKey}>{key}</Text>
              <Text style={[styles.margemVal, key === `${margem}%` && styles.margemValActive]}>
                {formatMT(val)}
              </Text>
            </View>
          ))}
        </View>

        {/* Ações */}
        <CustomButton
          title={saved ? '✓ Guardado no histórico' : 'Guardar orçamento'}
          onPress={guardar}
          loading={saving}
          disabled={saved}
          style={styles.btn}
        />
        <CustomButton
          title="📤 Partilhar no WhatsApp"
          onPress={partilhar}
          variant="secondary"
          style={styles.btn}
        />
        <CustomButton
          title="Novo cálculo"
          onPress={() => navigation.navigate('NovoOrcamento')}
          variant="secondary"
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  produtoCard: {
    backgroundColor: colors.primary, borderRadius: 14, padding: 16, marginBottom: 16,
  },
  produtoNome: { fontSize: 18, fontWeight: '800', color: '#fff' },
  produtoSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  resultadoCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
  },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  resultLabel: { fontSize: 14, color: colors.textSecondary },
  resultVal: { fontSize: 15, fontWeight: '600', color: colors.text },
  destaque: {
    backgroundColor: colors.primary + '12', borderRadius: 10,
    padding: 12, marginTop: 8, borderBottomWidth: 0,
  },
  destaqueLabel: { fontSize: 15, fontWeight: '700', color: colors.primary },
  destaqueVal: { fontSize: 24, fontWeight: '900', color: colors.primary },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10 },
  margensCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  margemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  margemKey: { fontSize: 14, color: colors.textSecondary },
  margemVal: { fontSize: 14, fontWeight: '600', color: colors.text },
  margemValActive: { color: colors.primary, fontWeight: '800' },
  btn: { marginBottom: 10 },
});
