import React, { useEffect, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { SelectPicker } from '../../components/common/SelectPicker';
import { useProdutosStore } from '../../store/useProdutosStore';
import { useAppStore } from '../../store/useAppStore';
import { getProdutoById } from '../../services/produtos.service';
import { calcularCustoProduto, calcularOrcamento } from '../../services/calculadora.service';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { MARGENS_RAPIDAS } from '../../utils/constants';
import { Produto } from '../../types/produto.types';
import { ResultadoCalculo } from '../../types/orcamento.types';

export function NovoOrcamentoScreen({ navigation, route }: any) {
  const produtoParam = route.params?.produto as Produto | undefined;
  const { produtos, load } = useProdutosStore();
  const config = useAppStore(s => s.configuracoes);

  const [produtoSelecionado, setProdutoSelecionado] = useState<string>(produtoParam?.nome ?? '');
  const [quantidade, setQuantidade] = useState('1');
  const [margem, setMargem] = useState(String(config?.margem_padrao ?? 30));
  const [clienteNome, setClienteNome] = useState('');
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [produtoObj, setProdutoObj] = useState<Produto | null>(produtoParam ?? null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => { load(); }, []);

  const produtoNomes = produtos.map(p => p.nome);

  const handleSelectProduto = async (nome: string) => {
    setProdutoSelecionado(nome);
    setResultado(null);
    const p = produtos.find(pr => pr.nome === nome);
    if (p) {
      const full = await getProdutoById(p.id);
      setProdutoObj(full);
      setMargem(String(full?.margem_padrao ?? 30));
    }
  };

  const calcular = async () => {
    if (!produtoObj) return;
    setLoading(true);
    try {
      const full = await getProdutoById(produtoObj.id);
      if (!full) return;
      const custoPorUnidade = calcularCustoProduto(full.insumos ?? [], full.rendimento, full.custo_extra);
      const res = calcularOrcamento(
        custoPorUnidade,
        parseFloat(quantidade) || 1,
        parseFloat(margem) || 30,
        config?.arredondamento_ativo ?? true,
        config?.tipo_arredondamento ?? 'dezena'
      );
      setResultado(res);
      // Scroll automático para mostrar os resultados
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    } finally {
      setLoading(false);
    }
  };

  const irParaResultado = () => {
    if (!resultado || !produtoObj) return;
    navigation.navigate('ResultadoOrcamento', {
      resultado, produto: produtoObj,
      quantidade: parseFloat(quantidade),
      margem: parseFloat(margem),
      clienteNome,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Novo Orcamento" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Produto */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="storefront-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Produto / Serviço</Text>
            </View>
            <SelectPicker
              label="Selecionar produto"
              value={produtoSelecionado}
              options={produtoNomes}
              onChange={handleSelectProduto}
              required
            />
            <CustomInput
              label="Quantidade"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
              placeholder="Ex: 1"
              required
            />
            <CustomInput
              label="Nome do cliente (opcional)"
              value={clienteNome}
              onChangeText={setClienteNome}
              placeholder="Ex: Maria"
            />
          </View>

          {/* Margem */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trending-up-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Margem de lucro</Text>
            </View>
            <View style={styles.margemRow}>
              {MARGENS_RAPIDAS.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.margemBtn, margem === String(m) && styles.margemBtnActive]}
                  onPress={() => setMargem(String(m))}
                >
                  <Text style={[styles.margemBtnText, margem === String(m) && styles.margemBtnTextActive]}>
                    {m}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <CustomInput
              label="Ou digita a margem personalizada (%)"
              value={margem}
              onChangeText={setMargem}
              keyboardType="numeric"
              placeholder="Ex: 35"
            />
          </View>

          <TouchableOpacity
            style={[styles.calcBtn, !produtoSelecionado && styles.calcBtnDisabled]}
            onPress={calcular}
            disabled={!produtoSelecionado || loading}
          >
            {loading
              ? <Text style={styles.calcBtnText}>A calcular...</Text>
              : <>
                  <Ionicons name="calculator-outline" size={22} color="#fff" />
                  <Text style={styles.calcBtnText}>Calcular preco</Text>
                </>
            }
          </TouchableOpacity>

          {resultado && (
            <View style={styles.resultadoCard}>
              <View style={styles.resultadoHeader}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.resultadoTitle}>Resultado</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Custo total</Text>
                <Text style={styles.resultVal}>{formatMT(resultado.custo_total)}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Lucro ({margem}%)</Text>
                <Text style={[styles.resultVal, { color: colors.success }]}>{formatMT(resultado.valor_lucro)}</Text>
              </View>

              <View style={styles.precoDestaque}>
                <Text style={styles.precoDestaqueLabel}>Preço recomendado</Text>
                <Text style={styles.precoDestaqueVal} adjustsFontSizeToFit numberOfLines={1}>
                  {formatMT(resultado.preco_arredondado)}
                </Text>
              </View>

              <TouchableOpacity style={styles.detalhesBtn} onPress={irParaResultado}>
                <Text style={styles.detalhesBtnText}>Ver detalhes e partilhar</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16 },
  sectionCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  margemRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  margemBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    backgroundColor: colors.inputBg, borderWidth: 1.5, borderColor: colors.border,
  },
  margemBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  margemBtnText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  margemBtnTextActive: { color: '#fff' },
  calcBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16,
    marginBottom: 16,
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  calcBtnDisabled: { backgroundColor: colors.border, shadowOpacity: 0 },
  calcBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  resultadoCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 18,
    borderWidth: 1.5, borderColor: colors.primary + '40',
    shadowColor: colors.primary, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  resultadoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  resultadoTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  resultLabel: { fontSize: 14, color: colors.textSecondary },
  resultVal: { fontSize: 14, fontWeight: '600', color: colors.text },
  precoDestaque: {
    backgroundColor: colors.primary, borderRadius: 14, padding: 16,
    marginTop: 12, marginBottom: 14, alignItems: 'center',
  },
  precoDestaqueLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  precoDestaqueVal: { fontSize: 32, fontWeight: '900', color: '#fff' },
  detalhesBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primaryDark, borderRadius: 12, paddingVertical: 12,
  },
  detalhesBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
