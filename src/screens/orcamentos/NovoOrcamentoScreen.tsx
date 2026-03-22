import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      const custoPorUnidade = calcularCustoProduto(
        full.insumos ?? [],
        full.rendimento,
        full.custo_extra
      );
      const res = calcularOrcamento(
        custoPorUnidade,
        parseFloat(quantidade) || 1,
        parseFloat(margem) || 30,
        config?.arredondamento_ativo ?? true,
        config?.tipo_arredondamento ?? 'dezena'
      );
      setResultado(res);
    } finally {
      setLoading(false);
    }
  };

  const irParaResultado = () => {
    if (!resultado || !produtoObj) return;
    navigation.navigate('ResultadoOrcamento', {
      resultado,
      produto: produtoObj,
      quantidade: parseFloat(quantidade),
      margem: parseFloat(margem),
      clienteNome,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Novo Orçamento" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <SelectPicker
          label="Produto / Serviço"
          value={produtoSelecionado}
          options={produtoNomes}
          onChange={handleSelectProduto}
        />

        <CustomInput
          label="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
          placeholder="Ex: 1"
        />

        <CustomInput
          label="Nome do cliente (opcional)"
          value={clienteNome}
          onChangeText={setClienteNome}
          placeholder="Ex: Maria"
        />

        {/* Margem rápida */}
        <Text style={styles.margemLabel}>Margem de lucro</Text>
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
          label="Ou digita a margem (%)"
          value={margem}
          onChangeText={setMargem}
          keyboardType="numeric"
          placeholder="Ex: 35"
        />

        <CustomButton
          title="Calcular preço"
          onPress={calcular}
          loading={loading}
          disabled={!produtoSelecionado}
          style={styles.calcBtn}
        />

        {resultado && (
          <View style={styles.previewBox}>
            <Text style={styles.previewTitle}>Resultado rápido</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Custo total</Text>
              <Text style={styles.previewVal}>{formatMT(resultado.custo_total)}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Lucro ({margem}%)</Text>
              <Text style={[styles.previewVal, { color: colors.success }]}>{formatMT(resultado.valor_lucro)}</Text>
            </View>
            <View style={[styles.previewRow, styles.previewHighlight]}>
              <Text style={styles.previewLabelBig}>Preço sugerido</Text>
              <Text style={styles.previewValBig}>{formatMT(resultado.preco_arredondado)}</Text>
            </View>
            <CustomButton title="Ver detalhes completos →" onPress={irParaResultado} style={{ marginTop: 12 }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  margemLabel: { fontSize: 13, fontWeight: '500', color: colors.text, marginBottom: 8 },
  margemRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  margemBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border,
  },
  margemBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  margemBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  margemBtnTextActive: { color: '#fff' },
  calcBtn: { marginTop: 8, marginBottom: 20 },
  previewBox: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: colors.border,
  },
  previewTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  previewLabel: { fontSize: 14, color: colors.textSecondary },
  previewVal: { fontSize: 14, fontWeight: '600', color: colors.text },
  previewHighlight: {
    backgroundColor: colors.primary + '10', borderRadius: 10,
    padding: 12, marginTop: 4,
  },
  previewLabelBig: { fontSize: 15, fontWeight: '700', color: colors.primary },
  previewValBig: { fontSize: 20, fontWeight: '800', color: colors.primary },
});
