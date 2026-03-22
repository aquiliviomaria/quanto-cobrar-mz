import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrcamentosStore } from '../../store/useOrcamentosStore';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { STATUS_COLORS, STATUS_ORCAMENTO } from '../../utils/constants';
import { Orcamento } from '../../types/orcamento.types';

export function HistoricoOrcamentosScreen({ navigation }: any) {
  const { orcamentos, load, updateStatus, remove } = useOrcamentosStore();

  useEffect(() => { load(); }, []);

  const handleStatus = (item: Orcamento) => {
    Alert.alert('Alterar status', 'Seleciona o novo status:', [
      ...STATUS_ORCAMENTO.map(s => ({
        text: s.charAt(0).toUpperCase() + s.slice(1),
        onPress: () => updateStatus(item.id, s),
      })),
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleDelete = (item: Orcamento) => {
    Alert.alert('Eliminar', 'Eliminar este orçamento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => remove(item.id) },
    ]);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Histórico</Text>
      </View>
      <FlatList
        data={orcamentos}
        keyExtractor={o => String(o.id)}
        contentContainerStyle={orcamentos.length === 0 ? { flex: 1 } : { padding: 16 }}
        ListEmptyComponent={
          <EmptyState icon="📋" title="Nenhum orçamento ainda" subtitle="Os teus orçamentos aparecerão aqui" />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardProduto}>{item.produto_nome}</Text>
                {item.cliente_nome ? <Text style={styles.cardCliente}>👤 {item.cliente_nome}</Text> : null}
                <Text style={styles.cardData}>{formatDate(item.created_at)}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardPreco}>{formatMT(item.preco_arredondado)}</Text>
                <TouchableOpacity
                  style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}
                  onPress={() => handleStatus(item)}
                >
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                    {item.status}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.cardDetail}>Custo: {formatMT(item.custo_total)} · Margem: {item.margem_aplicada}%</Text>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardTop: { flexDirection: 'row', marginBottom: 8 },
  cardProduto: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardCliente: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  cardData: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  cardPreco: { fontSize: 17, fontWeight: '800', color: colors.primaryDark },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 },
  cardDetail: { fontSize: 12, color: colors.textSecondary },
  deleteBtn: { fontSize: 18 },
});
