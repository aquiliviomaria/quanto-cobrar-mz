import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { SelectPicker } from '../../components/common/SelectPicker';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useProdutosStore } from '../../store/useProdutosStore';
import { useInsumosStore } from '../../store/useInsumosStore';
import { CATEGORIAS_PRODUTO } from '../../utils/constants';
import { colors } from '../../theme';
import { ProdutoInsumo } from '../../types/produto.types';

const schema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
  descricao: z.string().optional(),
  rendimento: z.string().min(1, 'Rendimento obrigatório'),
  unidade_rendimento: z.string().min(1, 'Unidade obrigatória'),
  custo_extra: z.string(),
  margem_padrao: z.string().min(1, 'Margem obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function AddProdutoScreen({ navigation, route }: any) {
  const produto = route.params?.produto;
  const { create, update } = useProdutosStore();
  const { insumos, load: loadInsumos } = useInsumosStore();
  const [insumosAdicionados, setInsumosAdicionados] = useState<ProdutoInsumo[]>([]);

  useEffect(() => {
    loadInsumos();
    if (produto?.insumos) setInsumosAdicionados(produto.insumos);
  }, []);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: produto?.nome ?? '',
      categoria: produto?.categoria ?? '',
      descricao: produto?.descricao ?? '',
      rendimento: produto?.rendimento?.toString() ?? '1',
      unidade_rendimento: produto?.unidade_rendimento ?? 'unidade',
      custo_extra: produto?.custo_extra?.toString() ?? '0',
      margem_padrao: produto?.margem_padrao?.toString() ?? '30',
    },
  });

  const addInsumo = () => {
    if (insumos.length === 0) {
      Alert.alert('Sem insumos', 'Adiciona insumos primeiro na secção de Insumos.');
      return;
    }
    // Mostrar picker de insumos
    Alert.alert(
      'Adicionar insumo',
      'Seleciona um insumo:',
      insumos.slice(0, 8).map(i => ({
        text: i.nome,
        onPress: () => {
          Alert.prompt(
            `Quantidade de ${i.nome}`,
            `Unidade: ${i.unidade}`,
            (qtd) => {
              if (qtd && parseFloat(qtd) > 0) {
                setInsumosAdicionados(prev => {
                  const exists = prev.find(p => p.insumo_id === i.id);
                  if (exists) {
                    return prev.map(p => p.insumo_id === i.id ? { ...p, quantidade_usada: parseFloat(qtd) } : p);
                  }
                  return [...prev, {
                    produto_id: produto?.id ?? 0,
                    insumo_id: i.id,
                    quantidade_usada: parseFloat(qtd),
                    insumo_nome: i.nome,
                    insumo_unidade: i.unidade,
                    custo_unitario: i.custo_unitario,
                  }];
                });
              }
            },
            'plain-text',
            '',
            'numeric'
          );
        },
      }))
    );
  };

  const removeInsumo = (insumo_id: number) => {
    setInsumosAdicionados(prev => prev.filter(p => p.insumo_id !== insumo_id));
  };

  const onSubmit = async (data: FormData) => {
    const input = {
      nome: data.nome,
      categoria: data.categoria as any,
      descricao: data.descricao,
      rendimento: parseFloat(data.rendimento),
      unidade_rendimento: data.unidade_rendimento,
      custo_extra: parseFloat(data.custo_extra || '0'),
      margem_padrao: parseFloat(data.margem_padrao),
      insumos: insumosAdicionados,
    };
    if (produto) {
      await update(produto.id, input);
    } else {
      await create(input);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={produto ? 'Editar Produto' : 'Novo Produto'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Controller control={control} name="nome"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Nome do produto/serviço" value={value} onChangeText={onChange}
              placeholder="Ex: Bolo de aniversário 2kg" error={errors.nome?.message} />
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
            <CustomInput label="Descrição (opcional)" value={value ?? ''} onChangeText={onChange}
              placeholder="Detalhes do produto..." multiline numberOfLines={2} />
          )}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Controller control={control} name="rendimento"
              render={({ field: { onChange, value } }) => (
                <CustomInput label="Rendimento" value={value} onChangeText={onChange}
                  keyboardType="numeric" placeholder="Ex: 12" error={errors.rendimento?.message} />
              )}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Controller control={control} name="unidade_rendimento"
              render={({ field: { onChange, value } }) => (
                <CustomInput label="Unidade" value={value} onChangeText={onChange}
                  placeholder="unidade / kg" error={errors.unidade_rendimento?.message} />
              )}
            />
          </View>
        </View>

        <Controller control={control} name="custo_extra"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Custo extra fixo (MT)" value={value} onChangeText={onChange}
              keyboardType="numeric" placeholder="Ex: 50 (embalagem, gás...)" />
          )}
        />
        <Controller control={control} name="margem_padrao"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Margem de lucro padrão (%)" value={value} onChangeText={onChange}
              keyboardType="numeric" placeholder="Ex: 30" error={errors.margem_padrao?.message} />
          )}
        />

        {/* Insumos */}
        <View style={styles.insumosSection}>
          <View style={styles.insumosTitleRow}>
            <Text style={styles.insumosTitle}>Insumos usados</Text>
            <TouchableOpacity style={styles.addInsumoBtn} onPress={addInsumo}>
              <Text style={styles.addInsumoBtnText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          {insumosAdicionados.length === 0
            ? <Text style={styles.noInsumos}>Nenhum insumo adicionado</Text>
            : insumosAdicionados.map(pi => (
              <View key={pi.insumo_id} style={styles.insumoRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insumoNome}>{pi.insumo_nome}</Text>
                  <Text style={styles.insumoQtd}>{pi.quantidade_usada} {pi.insumo_unidade}</Text>
                </View>
                <TouchableOpacity onPress={() => removeInsumo(pi.insumo_id)}>
                  <Text style={{ fontSize: 18 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          }
        </View>

        <CustomButton
          title={produto ? 'Guardar alterações' : 'Criar produto'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  row: { flexDirection: 'row', gap: 12 },
  insumosSection: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: colors.border,
  },
  insumosTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  insumosTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  addInsumoBtn: { backgroundColor: colors.primary + '20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  addInsumoBtnText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  noInsumos: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', paddingVertical: 8 },
  insumoRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  insumoNome: { fontSize: 14, fontWeight: '600', color: colors.text },
  insumoQtd: { fontSize: 12, color: colors.textSecondary },
  btn: { marginTop: 8 },
});
