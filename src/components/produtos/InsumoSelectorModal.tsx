import React, { useState } from 'react';
import {
  Modal, View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Insumo } from '../../types/insumo.types';
import { ProdutoInsumo } from '../../types/produto.types';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { getMedidasParaTipo, calcularCustoInsumoReceita } from '../../utils/conversoes';
import { SelectPicker } from '../common/SelectPicker';

interface Props {
  visible: boolean;
  insumos: Insumo[];
  onClose: () => void;
  onConfirm: (item: ProdutoInsumo) => void;
}

// Converte entre unidades (g↔kg, ml↔L)
function converterUnidades(valor: number, de: string, para: string): number | null {
  const d = de.toLowerCase().trim();
  const p = para.toLowerCase().trim();
  if (d === p) return valor;
  if (d === 'g' && p === 'kg') return valor / 1000;
  if (d === 'kg' && p === 'g') return valor * 1000;
  if (d === 'ml' && (p === 'l' || p === 'litro')) return valor / 1000;
  if ((d === 'l' || d === 'litro') && p === 'ml') return valor * 1000;
  return null;
}

export function InsumoSelectorModal({ visible, insumos, onClose, onConfirm }: Props) {
  const [step, setStep] = useState<'lista' | 'quantidade'>('lista');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Insumo | null>(null);

  // Estado da quantidade — sempre na unidade do insumo
  const [qtdNaUnidadeInsumo, setQtdNaUnidadeInsumo] = useState('1');
  const [erro, setErro] = useState('');

  // Conversor modal
  const [conversorVisible, setConversorVisible] = useState(false);
  const [medidaKey, setMedidaKey] = useState('');
  const [medidaQtd, setMedidaQtd] = useState('1');

  // Resultado do conversor (para exibição e para preencher a quantidade)
  const [conversorResultado, setConversorResultado] = useState<{
    qtdConvertida: number;      // ex: 240 (ml)
    unidadeBase: string;        // ex: 'ml'
    qtdNaUnidadeInsumo: number; // ex: 0.24 (L)
    custo: number;              // ex: 21.6 MT
    labelMedida: string;        // ex: "1 chávena (1 cup)"
  } | null>(null);

  const filtered = insumos.filter(i =>
    i.nome.toLowerCase().includes(search.toLowerCase())
  );

  const medidasDisponiveis = selected
    ? getMedidasParaTipo((selected as any).tipo_ingrediente ?? 'outro')
    : [];
  const medidaOpcoes = medidasDisponiveis.map(m => m.label);
  const medidaLabel = medidasDisponiveis.find(m => m.key === medidaKey)?.label ?? '';

  // Conversão em tempo real no modal do conversor
  const qtdMedida = parseFloat(medidaQtd);
  const conversao = selected && medidaKey && qtdMedida > 0
    ? calcularCustoInsumoReceita(
        (selected as any).tipo_ingrediente ?? 'outro',
        medidaKey, qtdMedida,
        selected.preco_total, selected.quantidade_comprada, selected.unidade,
      )
    : null;

  const handleSelectInsumo = (item: Insumo) => {
    setSelected(item);
    setQtdNaUnidadeInsumo('1');
    setMedidaKey('');
    setMedidaQtd('1');
    setConversorResultado(null);
    setErro('');
    setStep('quantidade');
  };

  // Ao clicar "Usar esta medida" no conversor
  const handleUsarMedida = () => {
    if (!conversao || !selected) return;

    // Converte o resultado (g/ml) para a unidade do insumo (kg/L)
    const qtdNaUnidade = converterUnidades(
      conversao.quantidadeConvertida,
      conversao.unidadeBase,
      selected.unidade
    ) ?? conversao.quantidadeConvertida;

    // Formata o label da medida
    const n = parseFloat(medidaQtd);
    const semUm = medidaLabel.replace(/^1\s+/, '');
    const plural = n > 1 ? semUm.replace(/^(ch[aá]vena|colher|copo)/i, m => m + 's') : semUm;
    const labelFormatado = `${n % 1 === 0 ? n.toFixed(0) : n} ${plural}`;

    setConversorResultado({
      qtdConvertida: conversao.quantidadeConvertida,
      unidadeBase: conversao.unidadeBase,
      qtdNaUnidadeInsumo: qtdNaUnidade,
      custo: conversao.custoEstimado,
      labelMedida: labelFormatado,
    });

    // Preenche a quantidade na unidade do insumo (para exibição)
    setQtdNaUnidadeInsumo(
      qtdNaUnidade % 1 === 0 ? qtdNaUnidade.toFixed(0) : qtdNaUnidade.toFixed(4)
    );

    setConversorVisible(false);
  };

  // Quando o utilizador altera manualmente a quantidade, limpa o resultado do conversor
  const handleQtdChange = (v: string) => {
    setQtdNaUnidadeInsumo(v);
    setConversorResultado(null); // limpa conversor ao editar manualmente
  };

  const handleConfirm = () => {
    if (!selected) return;
    const qtdNum = parseFloat(qtdNaUnidadeInsumo);
    if (!qtdNum || qtdNum <= 0) { setErro('Quantidade inválida.'); return; }

    let custoFinal: number;
    let qtdExibicao: number;
    let unidadeExibicao: string;

    if (conversorResultado) {
      // Usou conversor: custo já calculado correctamente
      custoFinal = conversorResultado.custo;
      qtdExibicao = conversorResultado.qtdConvertida; // ex: 240 ml
      unidadeExibicao = conversorResultado.unidadeBase; // ex: ml
    } else {
      // Sem conversor: quantidade está na unidade do insumo
      custoFinal = qtdNum * selected.custo_unitario;
      qtdExibicao = qtdNum;
      unidadeExibicao = selected.unidade;
    }

    onConfirm({
      produto_id: 0,
      insumo_id: selected.id,
      quantidade_usada: qtdExibicao,
      insumo_nome: selected.nome,
      insumo_unidade: unidadeExibicao,
      custo_unitario: custoFinal / qtdExibicao,
      custo_calculado: custoFinal,
      unidade_usada: unidadeExibicao,
    } as any);
    handleClose();
  };

  const handleClose = () => {
    setStep('lista'); setSelected(null); setQtdNaUnidadeInsumo('1');
    setMedidaKey(''); setMedidaQtd('1'); setErro(''); setSearch('');
    setConversorResultado(null); setConversorVisible(false);
    onClose();
  };

  const getMedidaKey = (label: string) =>
    medidasDisponiveis.find(m => m.label === label)?.key ?? '';

  // Custo em tempo real para exibição (sem conversor)
  const qtdNum = parseFloat(qtdNaUnidadeInsumo);
  const custoPreview = conversorResultado
    ? conversorResultado.custo
    : (qtdNum > 0 && selected ? qtdNum * selected.custo_unitario : 0);

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              {step === 'quantidade' && (
                <TouchableOpacity onPress={() => setStep('lista')} style={styles.iconBtn}>
                  <Ionicons name="arrow-back" size={20} color={colors.text} />
                </TouchableOpacity>
              )}
              <Text style={styles.title} numberOfLines={1}>
                {step === 'lista' ? 'Selecionar Insumo' : selected?.nome}
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.iconBtn}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            {step === 'lista' ? (
              <>
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
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.insumoItem} onPress={() => handleSelectInsumo(item)}>
                      <View style={styles.insumoIcon}>
                        <Ionicons name="cube-outline" size={18} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.insumoNome}>{item.nome}</Text>
                        <Text style={styles.insumoSub}>
                          {item.quantidade_comprada} {item.unidade} · {formatMT(item.preco_total)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.border} />
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.empty}>Nenhum insumo encontrado</Text>}
                />
              </>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {/* Info do insumo */}
                <View style={styles.insumoInfoCard}>
                  <View style={styles.insumoInfoRow}>
                    <Ionicons name="cube-outline" size={16} color={colors.primary} />
                    <Text style={styles.insumoInfoNome}>{selected?.nome}</Text>
                  </View>
                  <Text style={styles.insumoInfoSub}>
                    Registado: {selected?.quantidade_comprada} {selected?.unidade} · {formatMT(selected?.preco_total ?? 0)}
                  </Text>
                  <Text style={styles.insumoInfoSub}>
                    Custo por {selected?.unidade}: {formatMT(selected?.custo_unitario ?? 0)}
                  </Text>
                </View>

                {/* Se usou conversor, mostra o resultado */}
                {conversorResultado ? (
                  <View style={styles.conversorResultadoCard}>
                    <View style={styles.conversorResultadoRow}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                      <Text style={styles.conversorResultadoText}>
                        {conversorResultado.labelMedida} = {
                          conversorResultado.qtdConvertida % 1 === 0
                            ? conversorResultado.qtdConvertida.toFixed(0)
                            : conversorResultado.qtdConvertida.toFixed(2)
                        } {conversorResultado.unidadeBase}
                      </Text>
                    </View>
                    <Text style={styles.conversorResultadoCusto}>
                      Custo: {formatMT(conversorResultado.custo)}
                    </Text>
                    <TouchableOpacity onPress={() => { setConversorResultado(null); setQtdNaUnidadeInsumo('1'); }}>
                      <Text style={styles.limparConversor}>Limpar e usar quantidade directa</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {/* Quantidade directa na unidade do insumo */}
                    <Text style={styles.fieldLabel}>
                      Quantidade usada ({selected?.unidade}) <Text style={styles.asterisco}>*</Text>
                    </Text>
                    <View style={styles.qtdRow}>
                      <TouchableOpacity style={styles.qtdBtn}
                        onPress={() => handleQtdChange(String(Math.max(0.25, Math.round((parseFloat(qtdNaUnidadeInsumo||'1')-0.25)*100)/100)))}>
                        <Ionicons name="remove" size={20} color={colors.primary} />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.qtdInput}
                        value={qtdNaUnidadeInsumo}
                        onChangeText={handleQtdChange}
                        keyboardType="numeric"
                        placeholder="1"
                        placeholderTextColor={colors.textSecondary}
                      />
                      <TouchableOpacity style={styles.qtdBtn}
                        onPress={() => handleQtdChange(String(Math.round((parseFloat(qtdNaUnidadeInsumo||'0')+0.25)*100)/100))}>
                        <Ionicons name="add" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    {custoPreview > 0 && (
                      <Text style={styles.custoPreview}>
                        Custo estimado: {formatMT(custoPreview)}
                      </Text>
                    )}
                  </>
                )}

                {/* Botão conversor */}
                {!conversorResultado && (
                  <TouchableOpacity style={styles.conversorBtn} onPress={() => setConversorVisible(true)}>
                    <Ionicons name="swap-horizontal-outline" size={16} color={colors.primary} />
                    <Text style={styles.conversorBtnText}>Usar medida caseira (opcional)</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                  </TouchableOpacity>
                )}

                {erro ? (
                  <View style={styles.erroBox}>
                    <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                    <Text style={styles.erroText}>{erro}</Text>
                  </View>
                ) : null}

                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.confirmBtnText}>Adicionar ao produto</Text>
                </TouchableOpacity>
                <View style={{ height: 20 }} />
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal do conversor */}
      <Modal visible={conversorVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { maxHeight: '75%' }]}>
            <View style={styles.header}>
              <Text style={styles.title}>Conversor de medida caseira</Text>
              <TouchableOpacity onPress={() => setConversorVisible(false)} style={styles.iconBtn}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.conversorInfo}>
              Converte medida caseira para a unidade do insumo ({selected?.unidade}).
            </Text>

            <SelectPicker
              label="Medida caseira"
              value={medidaLabel}
              options={medidaOpcoes}
              onChange={(label) => setMedidaKey(getMedidaKey(label))}
            />

            <Text style={styles.fieldLabel}>Quantidade</Text>
            <View style={styles.qtdRow}>
              <TouchableOpacity style={styles.qtdBtn}
                onPress={() => setMedidaQtd(v => String(Math.max(0.25, Math.round((parseFloat(v||'1')-0.25)*100)/100)))}>
                <Ionicons name="remove" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TextInput
                style={styles.qtdInput}
                value={medidaQtd}
                onChangeText={setMedidaQtd}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity style={styles.qtdBtn}
                onPress={() => setMedidaQtd(v => String(Math.round((parseFloat(v||'0')+0.25)*100)/100))}>
                <Ionicons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {conversao && medidaKey && (
              <View style={styles.conversaoCard}>
                <Text style={styles.conversaoResultado}>
                  {(() => {
                    const n = parseFloat(medidaQtd);
                    const semUm = medidaLabel.replace(/^1\s+/, '');
                    const plural = n > 1 ? semUm.replace(/^(ch[aá]vena|colher|copo)/i, m => m + 's') : semUm;
                    return `${n % 1 === 0 ? n.toFixed(0) : n} ${plural}`;
                  })()} = {
                    conversao.quantidadeConvertida % 1 === 0
                      ? conversao.quantidadeConvertida.toFixed(0)
                      : conversao.quantidadeConvertida.toFixed(2)
                  } {conversao.unidadeBase}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.confirmBtn, !conversao && styles.confirmBtnDisabled]}
              onPress={handleUsarMedida}
              disabled={!conversao}
            >
              <Ionicons name="checkmark-outline" size={20} color="#fff" />
              <Text style={styles.confirmBtnText}>Usar esta medida</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '88%' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  list: { maxHeight: 340 },
  insumoItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  insumoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  insumoNome: { fontSize: 14, fontWeight: '600', color: colors.text },
  insumoSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  empty: { textAlign: 'center', color: colors.textSecondary, padding: 20 },
  insumoInfoCard: { backgroundColor: colors.primary + '10', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: colors.primary },
  insumoInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  insumoInfoNome: { fontSize: 15, fontWeight: '700', color: colors.text },
  insumoInfoSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: colors.text, marginBottom: 8 },
  asterisco: { color: colors.error, fontWeight: '700' },
  qtdRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  qtdBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  qtdInput: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: colors.text, borderBottomWidth: 2, borderBottomColor: colors.primary, paddingVertical: 4 },
  custoPreview: { fontSize: 13, color: colors.primary, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  conversorResultadoCard: { backgroundColor: colors.success + '12', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: colors.success + '40' },
  conversorResultadoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  conversorResultadoText: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  conversorResultadoCusto: { fontSize: 14, color: colors.primary, fontWeight: '700', marginTop: 4 },
  limparConversor: { fontSize: 12, color: colors.textSecondary, marginTop: 8, textDecorationLine: 'underline' },
  conversorBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary + '10', borderRadius: 12, padding: 12, marginBottom: 14 },
  conversorBtnText: { flex: 1, fontSize: 13, color: colors.primary, fontWeight: '600' },
  conversorInfo: { fontSize: 13, color: colors.textSecondary, marginBottom: 14, lineHeight: 18 },
  conversaoCard: { backgroundColor: colors.primary + '10', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1.5, borderColor: colors.primary + '40', alignItems: 'center' },
  conversaoResultado: { fontSize: 18, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  erroBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.error + '15', borderRadius: 10, padding: 10, marginBottom: 10 },
  erroText: { fontSize: 13, color: colors.error, flex: 1 },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14 },
  confirmBtnDisabled: { backgroundColor: colors.border },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
