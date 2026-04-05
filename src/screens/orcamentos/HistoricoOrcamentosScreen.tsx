import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrcamentosStore } from '../../store/useOrcamentosStore';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { STATUS_COLORS, STATUS_ORCAMENTO } from '../../utils/constants';
import { Orcamento } from '../../types/orcamento.types';

export function HistoricoOrcamentosScreen() {
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
    Alert.alert('Eliminar', 'Eliminar este orcamento?', [
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
          <EmptyState iconName="receipt-outline" title="Nenhum orcamento ainda"
            subtitle="Os teus orcamentos aparecerao aqui" />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardIconWrap}>
                <Ionicons name="receipt-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardProduto}>{item.produto_nome}</Text>
                {item.cliente_nome ? (
                  <View style={styles.clienteRow}>
                    <Ionicons name="person-outline" size={12} color={colors.textSecondary} />
                    <Text style={styles.cardCliente}>{item.cliente_nome}</Text>
                  </View>
                ) : null}
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
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                <Ionicons name="trash-outline" size={16} color={colors.error} />
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
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  cardIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center',
  },
  cardProduto: { fontSize: 15, fontWeight: '700', color: colors.text },
  clienteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  cardCliente: { fontSize: 12, color: colors.textSecondary },
  cardData: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  cardPreco: { fontSize: 16, fontWeight: '800', color: colors.primaryDark },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  cardBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8,
  },
  cardDetail: { fontSize: 12, color: colors.textSecondary },
  deleteBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: colors.error + '12', alignItems: 'center', justifyContent: 'center',
  },
});
