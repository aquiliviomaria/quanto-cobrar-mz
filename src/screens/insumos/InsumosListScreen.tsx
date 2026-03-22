import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
          <Text style={styles.addBtnText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
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
          <EmptyState icon="🛒" title="Nenhum insumo ainda" subtitle="Adiciona os teus ingredientes e materiais" />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardName}>{item.nome}</Text>
              <Text style={styles.cardSub}>{item.categoria} · {item.quantidade_comprada} {item.unidade}</Text>
              <Text style={styles.cardCusto}>Custo unitário: {formatMT(item.custo_unitario)}/{item.unidade}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardPreco}>{formatMT(item.preco_total)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('AddInsumo', { insumo: item })}>
                  <Text style={styles.editBtn}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Text style={styles.deleteBtn}>🗑️</Text>
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
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  searchBox: { paddingHorizontal: 16, marginBottom: 8 },
  searchInput: {
    backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, color: colors.text,
    borderWidth: 1, borderColor: colors.border,
  },
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardLeft: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardCusto: { fontSize: 12, color: colors.primary, marginTop: 4 },
  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  cardPreco: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  editBtn: { fontSize: 18 },
  deleteBtn: { fontSize: 18 },
});
