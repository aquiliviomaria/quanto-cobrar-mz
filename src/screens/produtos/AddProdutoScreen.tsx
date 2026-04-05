import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { SelectPicker } from '../../components/common/SelectPicker';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { KeyboardScroll } from '../../components/common/KeyboardScroll';
import { InsumoSelectorModal } from '../../components/produtos/InsumoSelectorModal';
import { useProdutosStore } from '../../store/useProdutosStore';
import { useInsumosStore } from '../../store/useInsumosStore';
import { CATEGORIAS_PRODUTO } from '../../utils/constants';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { ProdutoInsumo } from '../../types/produto.types';
import { getProdutoById } from '../../services/produtos.service';

const schema = z.object({
  nome: z.string().min(1, 'Nome obrigatorio'),
  categoria: z.string().min(1, 'Categoria obrigatoria'),
  descricao: z.string().optional(),
  custo_extra: z.string(),
  margem_padrao: z.string().min(1, 'Margem obrigatoria'),
});

type FormData = z.infer<typeof schema>;

export function AddProdutoScreen({ navigation, route }: any) {
  const produto = route.params?.produto;
  const { create, update } = useProdutosStore();
  const { insumos, load: loadInsumos } = useInsumosStore();
  const [insumosAdicionados, setInsumosAdicionados] = useState<ProdutoInsumo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadInsumos();
    // Ao editar, carrega os insumos do produto directamente da DB
    if (produto?.id) {
      getProdutoById(produto.id).then(p => {
        if (p?.insumos && p.insumos.length > 0) {
          // Calcula custo_calculado para cada insumo
          const insumosComCusto = p.insumos.map(pi => ({
            ...pi,
            // Usa custo_calculado guardado na DB (correcto), fallback para cálculo simples
            custo_calculado: pi.custo_calculado ?? (pi.quantidade_usada * (pi.custo_unitario ?? 0)),
            unidade_usada: pi.unidade_usada ?? pi.insumo_unidade,
          }));
          setInsumosAdicionados(insumosComCusto as any);
        }
      });
    }
  }, []);

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: produto?.nome ?? '',
      categoria: produto?.categoria ?? '',
      descricao: produto?.descricao ?? '',
      custo_extra: produto?.custo_extra?.toString() ?? '0',
      margem_padrao: produto?.margem_padrao?.toString() ?? '30',
    },
  });

  const custo_extra = parseFloat(watch('custo_extra') || '0');

  // Custo total: usa SEMPRE custo_calculado que vem do modal (já correcto)
  const custoTotalInsumos = insumosAdicionados.reduce((acc, pi) => {
    const custo = (pi as any).custo_calculado ?? 0;
    return acc + custo;
  }, 0);
  const custoTotal = custoTotalInsumos + custo_extra;

  const handleAddInsumo = (pi: ProdutoInsumo) => {
    setInsumosAdicionados(prev => {
      const exists = prev.find(p => p.insumo_id === pi.insumo_id);
      if (exists) return prev.map(p => p.insumo_id === pi.insumo_id ? pi : p);
      return [...prev, pi];
    });
  };

  const removeInsumo = (insumo_id: number) => {
    setInsumosAdicionados(prev => prev.filter(p => p.insumo_id !== insumo_id));
  };

  const onSubmit = async (data: FormData) => {
    const input = {
      nome: data.nome,
      categoria: data.categoria as any,
      descricao: data.descricao,
      rendimento: 1, // fixo — custo já calculado por insumo
      unidade_rendimento: 'unidade',
      custo_extra: parseFloat(data.custo_extra || '0'),
      margem_padrao: parseFloat(data.margem_padrao),
      insumos: insumosAdicionados,
    };
    if (produto) await update(produto.id, input);
    else await create(input);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={produto ? 'Editar Produto' : 'Novo Produto'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardScroll>

        <Controller control={control} name="nome"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Nome do produto/servico" value={value} onChangeText={onChange}
              placeholder="Ex: Bolo de aniversario 2kg" error={errors.nome?.message} />
          )}
        />
        <Controller control={control} name="categoria"
          render={({ field: { onChange, value } }) => (
            <SelectPicker label="Categoria" value={value} options={CATEGORIAS_PRODUTO}
              onChange={onChange} error={errors.categoria?.message} />
          )}
        />
        <Controller control={control} name="descricao"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Descricao (opcional)" value={value ?? ''} onChangeText={onChange}
              placeholder="Detalhes do produto..." multiline numberOfLines={2} />
          )}
        />
        <Controller control={control} name="custo_extra"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Custo extra fixo (MT)" value={value} onChangeText={onChange}
              keyboardType="numeric" placeholder="Ex: 50 (embalagem, gas...)" />
          )}
        />
        <Controller control={control} name="margem_padrao"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Margem de lucro padrao (%)" value={value} onChangeText={onChange}
              keyboardType="numeric" placeholder="Ex: 30" error={errors.margem_padrao?.message} />
          )}
        />

        {/* Insumos */}
        <View style={styles.insumosSection}>
          <View style={styles.insumosTitleRow}>
            <View style={styles.insumosTitleLeft}>
              <Ionicons name="layers-outline" size={18} color={colors.primary} />
              <Text style={styles.insumosTitle}>Ingredientes / Insumos</Text>
            </View>
            <TouchableOpacity style={styles.addInsumoBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addInsumoBtnText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {insumosAdicionados.length === 0 ? (
            <View style={styles.emptyInsumos}>
              <Ionicons name="cube-outline" size={28} color={colors.border} />
              <Text style={styles.noInsumos}>Nenhum ingrediente adicionado</Text>
              <Text style={styles.noInsumosHint}>Toca em "Adicionar" para selecionar</Text>
            </View>
          ) : (
            <>
              {insumosAdicionados.map(pi => {
                const custoItem = (pi as any).custo_calculado ?? 0;
                // unidade_usada = unidade correcta após conversão (ex: ml)
                // insumo_unidade = unidade de compra do insumo (ex: L) — só como fallback
                const unidadeExibir = (pi as any).unidade_usada || pi.insumo_unidade;
                return (
                  <View key={pi.insumo_id} style={styles.insumoRow}>
                    <View style={styles.insumoIconWrap}>
                      <Ionicons name="cube-outline" size={16} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.insumoNome}>{pi.insumo_nome}</Text>
                      <Text style={styles.insumoQtd}>
                        {pi.quantidade_usada} {unidadeExibir}
                      </Text>
                    </View>
                    <View style={styles.insumoRight}>
                      <Text style={styles.insumoCusto}>{formatMT(custoItem)}</Text>
                      <TouchableOpacity style={styles.removeBtn} onPress={() => removeInsumo(pi.insumo_id)}>
                        <Ionicons name="trash-outline" size={14} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* Resumo */}
              <View style={styles.custoResumo}>
                <Text style={styles.custoResumoLabel}>Custo total estimado</Text>
                <Text style={styles.custoResumoVal}>{formatMT(custoTotal)}</Text>
              </View>
            </>
          )}
        </View>

        <CustomButton
          title={produto ? 'Guardar alteracoes' : 'Criar produto'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.btn}
        />
      </KeyboardScroll>

      <InsumoSelectorModal
        visible={modalVisible}
        insumos={insumos}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddInsumo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  insumosSection: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: colors.border,
  },
  insumosTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  insumosTitleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insumosTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  addInsumoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
  },
  addInsumoBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyInsumos: { alignItems: 'center', paddingVertical: 16, gap: 4 },
  noInsumos: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  noInsumosHint: { fontSize: 12, color: colors.border },
  insumoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border,
  },
  insumoIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center',
  },
  insumoNome: { fontSize: 14, fontWeight: '600', color: colors.text },
  insumoQtd: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  insumoRight: { alignItems: 'flex-end', gap: 4 },
  insumoCusto: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  removeBtn: {
    width: 28, height: 28, borderRadius: 7,
    backgroundColor: colors.error + '12', alignItems: 'center', justifyContent: 'center',
  },
  custoResumo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 10, paddingTop: 10, borderTopWidth: 1.5, borderTopColor: colors.primary + '30',
  },
  custoResumoLabel: { fontSize: 13, color: colors.textSecondary },
  custoResumoVal: { fontSize: 17, fontWeight: '800', color: colors.primary },
  btn: { marginTop: 8 },
});
