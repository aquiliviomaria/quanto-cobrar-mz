import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { SelectPicker } from '../../components/common/SelectPicker';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { KeyboardScroll } from '../../components/common/KeyboardScroll';
import { useInsumosStore } from '../../store/useInsumosStore';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import {
  TIPOS_INGREDIENTE, getMedidasParaTipo, getUnidadesCompraParaTipo,
  calcularCustoInsumoReceita,
} from '../../utils/conversoes';

export function AddInsumoScreen({ navigation, route }: any) {
  const insumo = route.params?.insumo;
  const { create, update } = useInsumosStore();

  const [nome, setNome] = useState(insumo?.nome ?? '');
  const [categoria, setCategoria] = useState(insumo?.categoria ?? 'Ingrediente');
  const [tipoKey, setTipoKey] = useState(insumo?.tipo_ingrediente ?? 'farinha_trigo');
  const [precoCompra, setPrecoCompra] = useState(insumo?.preco_total?.toString() ?? '');
  const [qtdComprada, setQtdComprada] = useState(insumo?.quantidade_comprada?.toString() ?? '');
  const [unidadeCompra, setUnidadeCompra] = useState(insumo?.unidade ?? 'kg');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const tipoOpcoes = TIPOS_INGREDIENTE.map(t => t.label);
  // Unidades de compra = medidas padrão do tipo + unidades base
  const unidadesCompra = [
    ...getUnidadesCompraParaTipo(tipoKey),
    ...getMedidasParaTipo(tipoKey).map(m => m.label),
  ].filter((v, i, arr) => arr.indexOf(v) === i); // sem duplicados

  // Reset unidade quando muda tipo (só se não estiver a editar)
  const isFirstRender = React.useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const uns = getUnidadesCompraParaTipo(tipoKey);
    setUnidadeCompra(uns[0] ?? 'g');
  }, [tipoKey]);

  const getTipoKey = (label: string) =>
    TIPOS_INGREDIENTE.find(t => t.label === label)?.key ?? 'outro';

  const getTipoLabel = (key: string) =>
    TIPOS_INGREDIENTE.find(t => t.key === key)?.label ?? '';

  // Custo unitário calculado
  const preco = parseFloat(precoCompra);
  const qtd = parseFloat(qtdComprada);
  const custoUnitario = preco > 0 && qtd > 0 ? preco / qtd : 0;

  const onSubmit = async () => {
    if (!nome.trim()) { setErro('Nome obrigatorio.'); return; }
    if (!preco || preco <= 0) { setErro('Preco de compra invalido.'); return; }
    if (!qtd || qtd <= 0) { setErro('Quantidade comprada invalida.'); return; }
    setErro(''); setLoading(true);
    try {
      const input = {
        nome: nome.trim(),
        categoria: categoria as any,
        quantidade_comprada: qtd,
        unidade: unidadeCompra as any,
        preco_total: preco,
        tipo_ingrediente: tipoKey,
      };
      if (insumo) await update(insumo.id, input);
      else await create(input);
      navigation.goBack();
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={insumo ? 'Editar Insumo' : 'Novo Insumo'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardScroll>

        {/* Secção 1 — Identificação */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Identificacao</Text>
          </View>

          <CustomInput
            label="Nome do insumo"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Farinha de trigo, Leite, Ovos..."
          />

          <SelectPicker
            label="Tipo de ingrediente"
            value={getTipoLabel(tipoKey)}
            options={tipoOpcoes}
            onChange={(label) => setTipoKey(getTipoKey(label))}
          />

          <SelectPicker
            label="Categoria"
            value={categoria}
            options={['Ingrediente', 'Embalagem', 'Decoracao', 'Transporte', 'Outro']}
            onChange={setCategoria}
          />
        </View>

        {/* Secção 2 — Compra */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Dados de compra</Text>
          </View>

          <CustomInput
            label="Preco de compra (MT)"
            value={precoCompra}
            onChangeText={setPrecoCompra}
            keyboardType="numeric"
            placeholder="Ex: 90"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Quantidade comprada"
                value={qtdComprada}
                onChangeText={setQtdComprada}
                keyboardType="numeric"
                placeholder="Ex: 1"
              />
            </View>
            <View style={{ flex: 1 }}>
              <SelectPicker
                label="Unidade"
                value={unidadeCompra}
                options={unidadesCompra}
                onChange={setUnidadeCompra}
              />
            </View>
          </View>

          {custoUnitario > 0 && (
            <View style={styles.custoBox}>
              <Ionicons name="calculator-outline" size={16} color={colors.primary} />
              <Text style={styles.custoText}>
                Custo por {unidadeCompra}: {formatMT(custoUnitario)}
              </Text>
            </View>
          )}
        </View>

        {erro ? (
          <View style={styles.erroBox}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        ) : null}

        <CustomButton
          title={insumo ? 'Guardar alteracoes' : 'Adicionar insumo'}
          onPress={onSubmit}
          loading={loading}
        />
      </KeyboardScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16 },
  sectionCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: colors.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  row: { flexDirection: 'row', gap: 12 },
  custoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.primary + '12', borderRadius: 10, padding: 10, marginTop: 4,
  },
  custoText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  erroBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.error + '15', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  erroText: { fontSize: 13, color: colors.error, flex: 1 },
});
