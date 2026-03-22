import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { colors } from '../../theme';

export function ConfigScreen() {
  const { configuracoes, loadConfiguracoes, saveConfiguracoes } = useAppStore();
  const [margem, setMargem] = useState('30');
  const [arredondamento, setArredondamento] = useState(true);
  const [tipoArred, setTipoArred] = useState<'dezena' | 'cinquenta' | 'centena'>('dezena');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfiguracoes();
  }, []);

  useEffect(() => {
    if (configuracoes) {
      setMargem(String(configuracoes.margem_padrao));
      setArredondamento(configuracoes.arredondamento_ativo);
      setTipoArred(configuracoes.tipo_arredondamento);
    }
  }, [configuracoes]);

  const salvar = async () => {
    setSaving(true);
    await saveConfiguracoes({
      margem_padrao: parseFloat(margem) || 30,
      arredondamento_ativo: arredondamento,
      tipo_arredondamento: tipoArred,
    });
    setSaving(false);
  };

  const tiposArred: Array<{ key: 'dezena' | 'cinquenta' | 'centena'; label: string }> = [
    { key: 'dezena', label: '10 MT' },
    { key: 'cinquenta', label: '50 MT' },
    { key: 'centena', label: '100 MT' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Configurações</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moeda</Text>
          <View style={styles.moedaBox}>
            <Text style={styles.moedaText}>🇲🇿 Metical (MT)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Margem de lucro padrão</Text>
          <CustomInput
            label="Percentagem (%)"
            value={margem}
            onChangeText={setMargem}
            keyboardType="numeric"
            placeholder="Ex: 30"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arredondamento de preço</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Activar arredondamento</Text>
            <Switch
              value={arredondamento}
              onValueChange={setArredondamento}
              trackColor={{ true: colors.primary }}
            />
          </View>
          {arredondamento && (
            <View style={styles.tiposRow}>
              {tiposArred.map(t => (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.tipoBtn, tipoArred === t.key && styles.tipoBtnActive]}
                  onPress={() => setTipoArred(t.key)}
                >
                  <Text style={[styles.tipoBtnText, tipoArred === t.key && styles.tipoBtnTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <CustomButton title="Guardar configurações" onPress={salvar} loading={saving} />

        <View style={styles.about}>
          <Text style={styles.aboutTitle}>Quanto Cobrar MZ</Text>
          <Text style={styles.aboutText}>Versão 1.0.0</Text>
          <Text style={styles.aboutText}>Saiba quanto cobrar. Venda sem prejuízo.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  scroll: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  moedaBox: {
    backgroundColor: colors.surface, borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  moedaText: { fontSize: 15, color: colors.text, fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  switchLabel: { fontSize: 14, color: colors.text },
  tiposRow: { flexDirection: 'row', gap: 10 },
  tipoBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border,
  },
  tipoBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tipoBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tipoBtnTextActive: { color: '#fff' },
  about: { marginTop: 32, alignItems: 'center', paddingBottom: 20 },
  aboutTitle: { fontSize: 16, fontWeight: '800', color: colors.primary },
  aboutText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
