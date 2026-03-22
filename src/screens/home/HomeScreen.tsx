import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { useInsumosStore } from '../../store/useInsumosStore';
import { useProdutosStore } from '../../store/useProdutosStore';
import { useOrcamentosStore } from '../../store/useOrcamentosStore';

const cards = [
  { icon: '🧮', label: 'Novo Orçamento', screen: 'NovoOrcamento', color: colors.primary },
  { icon: '🎂', label: 'Produtos / Serviços', screen: 'ProdutosList', color: '#7C3AED' },
  { icon: '🛒', label: 'Insumos', screen: 'InsumosList', color: '#0EA5E9' },
  { icon: '📋', label: 'Histórico', screen: 'Historico', color: '#F59E0B' },
];

export function HomeScreen({ navigation }: any) {
  const insumos = useInsumosStore(s => s.insumos);
  const produtos = useProdutosStore(s => s.produtos);
  const orcamentos = useOrcamentosStore(s => s.orcamentos);

  useEffect(() => {
    useInsumosStore.getState().load();
    useProdutosStore.getState().load();
    useOrcamentosStore.getState().load();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá 👋</Text>
          <Text style={styles.title}>Quanto Cobrar MZ</Text>
          <Text style={styles.subtitle}>Saiba quanto cobrar. Venda sem prejuízo.</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{insumos.length}</Text>
            <Text style={styles.statLabel}>Insumos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{produtos.length}</Text>
            <Text style={styles.statLabel}>Produtos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{orcamentos.length}</Text>
            <Text style={styles.statLabel}>Orçamentos</Text>
          </View>
        </View>

        {/* Menu cards */}
        <Text style={styles.sectionTitle}>O que queres fazer?</Text>
        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.screen}
              style={[styles.card, { borderLeftColor: card.color }]}
              onPress={() => navigation.navigate(card.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 14, color: colors.textSecondary },
  title: { fontSize: 26, fontWeight: '800', color: colors.primary, marginTop: 2 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 12,
    padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statNum: { fontSize: 24, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  grid: { gap: 12 },
  card: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardIcon: { fontSize: 28 },
  cardLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
});
