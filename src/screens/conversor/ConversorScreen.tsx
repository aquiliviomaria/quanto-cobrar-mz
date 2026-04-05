import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/common/CustomInput';
import { SelectPicker } from '../../components/common/SelectPicker';
import { colors } from '../../theme';
import { useInsumosStore } from '../../store/useInsumosStore';
import { getMedidasParaTipo, calcularCustoInsumoReceita } from '../../utils/conversoes';
import { MEDIDAS_PADRAO } from '../../utils/medidas';

export function ConversorScreen() {
  const { insumos, load } = useInsumosStore();
  const [quantidade, setQuantidade] = useState('1');
  const [medidaId, setMedidaId] = useState('');
  const [insumoKey, setInsumoKey] = useState('');
  const [resultado, setResultado] = useState<{ valor: number; unidade: string } | null>(null);

  useEffect(() => { load(); }, []);

  // Insumos do stock como opções
  const insumoOpcoes = ['Nenhum (so volume)', ...insumos.map(i => i.nome)];
  const insumoSelecionado = insumos.find(i => i.nome === insumoKey) ?? null;

  // Medidas disponíveis para o tipo do insumo seleccionado
  const tipoKey = (insumoSelecionado as any)?.tipo_ingrediente ?? 'outro';
  const medidasDisponiveis = getMedidasParaTipo(tipoKey);
  const medidaOpcoes = medidasDisponiveis.map(m => m.label);
  const medidaSelecionada = medidasDisponiveis.find(m => m.key === medidaId);

  // Se não há insumo, padrão
  const medidasGerais = MEDIDAS_PADRAO.map(m => m.nome);
  const medidaGeral = MEDIDAS_PADRAO.find(m => m.id === medidaId);

  const calcular = () => {
    const qtd = parseFloat(quantidade);
    if (!qtd || qtd <= 0) return;

    if (insumoSelecionado && medidaId) {
      const conv = calcularCustoInsumoReceita(
        tipoKey, medidaId, qtd,
        insumoSelecionado.preco_total,
        insumoSelecionado.quantidade_comprada,
        insumoSelecionado.unidade,
      );
      if (conv) {
        setResultado({ valor: conv.quantidadeConvertida, unidade: conv.unidadeBase });
        return;
      }
    }

    // Sem insumo — conversão de volume
    const medida = MEDIDAS_PADRAO.find(m => m.id === medidaId || m.nome === medidaId);
    if (medida && medida.valueMl > 0) {
      setResultado({ valor: qtd * medida.valueMl, unidade: 'ml' });
    }
  };

  const handleSelectInsumo = (nome: string) => {
    setInsumoKey(nome === 'Nenhum (so volume)' ? '' : nome);
    setMedidaId('');
    setResultado(null);
  };

  const handleSelectMedida = (label: string) => {
    if (insumoSelecionado) {
      const m = medidasDisponiveis.find(m => m.label === label);
      setMedidaId(m?.key ?? '');
    } else {
      const m = MEDIDAS_PADRAO.find(m => m.nome === label);
      setMedidaId(m?.id ?? '');
    }
    setResultado(null);
  };

  const medidaValorAtual = insumoSelecionado
    ? (medidaSelecionada?.label ?? '')
    : (medidaGeral?.nome ?? '');

  const medidaOpcoesAtual = insumoSelecionado ? medidaOpcoes : medidasGerais;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Conversor de Medidas</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.infoText}>
            Selecao.
          </Text>
        </View>

        {/* Ingrediente do stock */}
        <SelectPicker
          label="Ingrediente do stock (opcional)"
          value={insumoKey || 'Nenhum (so volume)'}
          options={insumoOpcoes}
          onChange={handleSelectInsumo}
        />

        {/* Medida */}
        <SelectPicker
          label="Medida caseira"
          value={medidaValorAtual}
          options={medidaOpcoesAtual}
          onChange={handleSelectMedida}
        />

        <CustomInput
          label="Quantidade"
          value={quantidade}
          onChangeText={v => { setQuantidade(v); setResultado(null); }}
          keyboardType="numeric"
          placeholder="Ex: 2"
        />

        <TouchableOpacity style={styles.calcBtn} onPress={calcular}>
          <Ionicons name="swap-horizontal-outline" size={20} color="#fff" />
          <Text style={styles.calcBtnText}>Converter</Text>
        </TouchableOpacity>

        {/* Resultado — sem custo */}
        {resultado && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Resultado</Text>
            <Text style={styles.resultVal}>
              {resultado.valor % 1 === 0
                ? resultado.valor.toFixed(0)
                : resultado.valor.toFixed(2)
              } {resultado.unidade}
            </Text>
            <Text style={styles.resultSub}>
              {quantidade} {medidaValorAtual}
              {insumoSelecionado ? ` de ${insumoSelecionado.nome}` : ''}
            </Text>
          </View>
      )}

        {/* Tabela rápida */}
        <Text style={styles.sectionTitle}>Referencia rapida</Text>
        <View style={styles.tabelaCard}>
          {[
            { label: '1 cup', val: '240 ml' },
            { label: '1/2 cup', val: '120 ml' },
            { label: '1/4 cup', val: '60 ml' },
            { label: '1 tbsp', val: '15 ml' },
            { label: '1 tsp', val: '5 ml' },
            { label: '1/2 tsp', val: '2.5 ml' },
            { label: '1/4 tsp', val: '1.25 ml' },
          ].=> (
            <View key={i} style={[styles.tabelaRow, i % 2 === 0 && styles.tabelaRowAlt]}>
              <Text style={styles.tabelaLabel}>{row.label}</Text>
              <Text style={styles.tabelaVal}>{row.val}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.nota}>
          Conversoes aproximadas. Para maior precisao, recomendamos pesar sempre que possivel.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sa flex: 1, backgroundColor: colors.background },
  topBar: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  scroll: { padding: 16 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.primary + '12', borderRadius: 12, padding: 12, marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },
  calcBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, marginTop: 4, marginBottom: 20,
  },
gHorizontal: 16 },
  tabelaRowAlt: { backgroundColor: colors.inputBg },
  tabelaLabel: { fontSize: 14, color: colors.text, fontWeight: '500' },
  tabelaVal: { fontSize: 14, color: colors.primary, fontWeight: '700' },
  nota: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, textAlign: 'center', paddingBottom: 20 },
});
  resultVal: { fontSize: 44, fontWeight: '900', color: colors.primary },
  resultSub: { fontSize: 13, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10 },
  tabelaCard: {
    backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden',
    marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  tabelaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddin  calcBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  resultCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 24,
    borderWidth: 2, borderColor: colors.primary,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  resultLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
