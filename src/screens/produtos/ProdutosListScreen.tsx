import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProdutosStore } from '../../store/useProdutosStore';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme';
import { Produto } from '../../types/produto.types';

export function ProdutosListScreen({ navigation }: any) {
  const { produtos, load, remove } = useProdutosStore();
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  const filtered = produtos.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (item: Produto) => {
    Alert.alert('Eliminar', `Eliminar "${item.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => remove(item.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Produtos / Serviços</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduto')}>
          <Text style={styles.addBtnText}>+ Criar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produto..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { padding: 16 }}
        ListEmptyComponent={
          <EmptyState icon="🎂" title="Nenhum produto ainda" subtitle="Cria o teu primeiro produto ou serviço" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AddProduto', { produto: item })}
            activeOpacity={0.8}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardName}>{item.nome}</Text>
              <Text style={styles.cardSub}>{item.categoria} · Rend: {item.rendimento} {item.unidade_rendimento}</Text>
              <Text style={styles.cardMargem}>Margem padrão: {item.margem_padrao}%</Text>
            </View>
            <View style={styles.cardRight}>
              <TouchableOpacity onPress={() => navigation.navigate('NovoOrcamento', { produto: item })}>
                <Text style={styles.orcBtn}>🧮</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  addBtn: { backgroundColor: '#7C3AED', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
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
  cardMargem: { fontSize: 12, color: '#7C3AED', marginTop: 4 },
  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  orcBtn: { fontSize: 22 },
  deleteBtn: { fontSize: 22 },
});
