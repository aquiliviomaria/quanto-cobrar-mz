import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useInsumosStore } from '../../store/useInsumosStore';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { Insumo } from '../../types/insumo.types';

export function InsumosListScreen({ navigation }: any) {
  const { insumos, load, remove } = useInsumosStore();
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  const filtered = insumos.filter(i =>
    i.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (item: Insumo) => {
    Alert.alert('Eliminar', `Eliminar "${item.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => remove(item.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Insumos</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddInsumo')}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar insumo..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { padding: 16 }}
        ListEmptyComponent={
          <EmptyState iconName="layers-outline" title="Nenhum insumo ainda"
            subtitle="Adiciona os teus ingredientes e materiais" />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="cube-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardLeft}>
              <Text style={styles.cardName}>{item.nome}</Text>
              <Text style={styles.cardSub}>{item.categoria} · {item.quantidade_comprada} {item.unidade}</Text>
              <Text style={styles.cardCusto}>{formatMT(item.custo_unitario)}/{item.unidade}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardPreco}>{formatMT(item.preco_total)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}
                  onPress={() => navigation.navigate('AddInsumo', { insumo: item })}>
                  <Ionicons name="pencil-outline" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]}
                  onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center',
  },
  cardLeft: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardCusto: { fontSize: 12, color: colors.primary, marginTop: 2, fontWeight: '500' },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  cardPreco: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center',
  },
  actionBtnDanger: { backgroundColor: colors.error + '12' },
});
