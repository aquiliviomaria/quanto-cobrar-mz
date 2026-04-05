import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

  const handleOptions = (item: Produto) => {
    Alert.alert(item.nome, 'O que queres fazer?', [
      { text: 'Editar', onPress: () => navigation.navigate('AddProduto', { produto: item }) },
      { text: 'Criar orcamento', onPress: () => navigation.navigate('NovoOrcamento', { produto: item }) },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(item) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Produtos / Serviços</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduto')}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Criar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
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
          <EmptyState iconName="storefront-outline" title="Nenhum produto ainda"
            subtitle="Cria o teu primeiro produto ou servico" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('NovoOrcamento', { produto: item })}
            onLongPress={() => handleOptions(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="storefront-outline" size={20} color="#7C3AED" />
            </View>
            <View style={styles.cardLeft}>
              <Text style={styles.cardName}>{item.nome}</Text>
              <Text style={styles.cardSub}>{item.categoria}</Text>
              <Text style={styles.cardMargem}>Margem padrao: {item.margem_padrao}%</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary + '15' }]}
                onPress={() => navigation.navigate('NovoOrcamento', { produto: item })}
              >
                <Ionicons name="calculator-outline" size={17} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#7C3AED' + '15' }]}
                onPress={() => navigation.navigate('AddProduto', { produto: item })}
              >
                <Ionicons name="pencil-outline" size={17} color="#7C3AED" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.error + '15' }]}
                onPress={() => handleDelete(item)}
              >
                <Ionicons name="trash-outline" size={17} color={colors.error} />
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
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#7C3AED', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
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
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  cardIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#7C3AED' + '12', alignItems: 'center', justifyContent: 'center',
  },
  cardLeft: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardMargem: { fontSize: 12, color: '#7C3AED', marginTop: 2, fontWeight: '500' },
  cardActions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionBtn: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
});
