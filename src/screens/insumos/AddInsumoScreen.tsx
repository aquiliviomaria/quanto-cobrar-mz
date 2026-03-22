import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { SelectPicker } from '../../components/common/SelectPicker';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useInsumosStore } from '../../store/useInsumosStore';
import { CATEGORIAS_INSUMO, UNIDADES_INSUMO } from '../../utils/constants';
import { colors } from '../../theme';

const schema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  categoria: z.string().min(1, 'Categoria obrigatória'),
  quantidade_comprada: z.string().min(1, 'Quantidade obrigatória'),
  unidade: z.string().min(1, 'Unidade obrigatória'),
  preco_total: z.string().min(1, 'Preço obrigatório'),
});

type FormData = z.infer<typeof schema>;

export function AddInsumoScreen({ navigation, route }: any) {
  const insumo = route.params?.insumo;
  const { create, update } = useInsumosStore();

  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: insumo?.nome ?? '',
      categoria: insumo?.categoria ?? '',
      quantidade_comprada: insumo?.quantidade_comprada?.toString() ?? '',
      unidade: insumo?.unidade ?? '',
      preco_total: insumo?.preco_total?.toString() ?? '',
    },
  });

  const qtd = watch('quantidade_comprada');
  const preco = watch('preco_total');
  const custoUnitario = qtd && preco && parseFloat(qtd) > 0
    ? (parseFloat(preco) / parseFloat(qtd)).toFixed(2)
    : null;

  const onSubmit = async (data: FormData) => {
    const input = {
      nome: data.nome,
      categoria: data.categoria as any,
      quantidade_comprada: parseFloat(data.quantidade_comprada),
      unidade: data.unidade as any,
      preco_total: parseFloat(data.preco_total),
    };
    if (insumo) {
      await update(insumo.id, input);
    } else {
      await create(input);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={insumo ? 'Editar Insumo' : 'Novo Insumo'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Controller control={control} name="nome"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Nome do insumo" value={value} onChangeText={onChange}
              placeholder="Ex: Farinha de trigo" error={errors.nome?.message} />
          )}
        />
        <Controller control={control} name="categoria"
          render={({ field: { onChange, value } }) => (
            <SelectPicker label="Categoria" value={value} options={CATEGORIAS_INSUMO}
              onChange={onChange} error={errors.categoria?.message} />
          )}
        />
        <Controller control={control} name="quantidade_comprada"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Quantidade comprada" value={value} onChangeText={onChange}
              placeholder="Ex: 1000" keyboardType="numeric" error={errors.quantidade_comprada?.message} />
          )}
        />
        <Controller control={control} name="unidade"
          render={({ field: { onChange, value } }) => (
            <SelectPicker label="Unidade" value={value} options={UNIDADES_INSUMO}
              onChange={onChange} error={errors.unidade?.message} />
          )}
        />
        <Controller control={control} name="preco_total"
          render={({ field: { onChange, value } }) => (
            <CustomInput label="Preço total (MT)" value={value} onChangeText={onChange}
              placeholder="Ex: 85" keyboardType="numeric" error={errors.preco_total?.message} />
          )}
        />

        {custoUnitario && (
          <View style={styles.custoBox}>
            <Text style={styles.custoLabel}>Custo unitário calculado</Text>
            <Text style={styles.custoValue}>{custoUnitario} MT / {watch('unidade') || 'unidade'}</Text>
          </View>
        )}

        <CustomButton
          title={insumo ? 'Guardar alterações' : 'Adicionar insumo'}
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
  custoBox: {
    backgroundColor: colors.primary + '15', borderRadius: 10, padding: 14,
    marginBottom: 20, alignItems: 'center',
  },
  custoLabel: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  custoValue: { fontSize: 20, fontWeight: '800', color: colors.primary, marginTop: 4 },
  btn: { marginTop: 8 },
});
