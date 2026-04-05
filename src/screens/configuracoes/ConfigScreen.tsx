import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { colors } from '../../theme';

export function ConfigScreen() {
  const { configuracoes, loadConfiguracoes, saveConfiguracoes } = useAppStore();
  const { utilizador, updatePerfil, logout } = useAuthStore();

  // Config
  const [margem, setMargem] = useState('30');
  const [arredondamento, setArredondamento] = useState(true);
  const [tipoArred, setTipoArred] = useState<'dezena' | 'cinquenta' | 'centena'>('dezena');
  const [savingConfig, setSavingConfig] = useState(false);

  // Perfil
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaActual, setSenhaActual] = useState('');
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

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

  useEffect(() => {
    if (utilizador) {
      setNome(utilizador.nome ?? '');
      setEmpresa(utilizador.empresa ?? '');
      setTelefone(utilizador.telefone ?? '');
    }
  }, [utilizador]);

  const salvarConfig = async () => {
    setSavingConfig(true);
    await saveConfiguracoes({
      margem_padrao: parseFloat(margem) || 30,
      arredondamento_ativo: arredondamento,
      tipo_arredondamento: tipoArred,
    });
    setSavingConfig(false);
    Alert.alert('Guardado', 'Configuracoes actualizadas.');
  };

  const salvarPerfil = async () => {
    if (!nome.trim()) { Alert.alert('Erro', 'O nome nao pode estar vazio.'); return; }
    if (novaSenha) {
      if (!senhaActual) { Alert.alert('Erro', 'Introduz a tua senha actual.'); return; }
      if (novaSenha !== confirmarSenha) { Alert.alert('Erro', 'As senhas nao coincidem.'); return; }
      if (novaSenha.length < 4) { Alert.alert('Erro', 'A nova senha deve ter pelo menos 4 caracteres.'); return; }
    }
    setSavingPerfil(true);
    try {
      await updatePerfil({ nome, empresa, telefone, ...(novaSenha ? { senha: novaSenha, senhaActual } : {}) });
      setSenhaActual(''); setNovaSenha(''); setConfirmarSenha('');
      Alert.alert('Guardado', 'Perfil actualizado com sucesso.');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setSavingPerfil(false);
    }
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

        {/* Perfil */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Perfil</Text>
          </View>
          <CustomInput label="Nome completo" value={nome} onChangeText={setNome} placeholder="O teu nome" />
          <CustomInput label="Nome da empresa (opcional)" value={empresa} onChangeText={setEmpresa}
            placeholder="Ex: Confeitaria da Maria" />
          <CustomInput label="Telefone / Celular (opcional)" value={telefone} onChangeText={setTelefone}
            placeholder="Ex: +258 84 000 0000" keyboardType="phone-pad" />
          <CustomButton title="Guardar perfil" onPress={salvarPerfil} loading={savingPerfil} />
        </View>

        {/* Alterar senha */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Alterar senha</Text>
          </View>
          <View style={styles.senhaWrap}>
            <CustomInput
              label="Senha actual" value={senhaActual} onChangeText={setSenhaActual}
              placeholder="A tua senha actual" secureTextEntry={!showSenha} required
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowSenha(v => !v)}>
              <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <CustomInput
            label="Nova senha" value={novaSenha} onChangeText={setNovaSenha}
            placeholder="Minimo 4 caracteres" secureTextEntry={!showSenha}
          />
          <CustomInput
            label="Confirmar nova senha" value={confirmarSenha} onChangeText={setConfirmarSenha}
            placeholder="Repete a nova senha" secureTextEntry={!showSenha}
          />
          <Text style={styles.senhaHint}>
            Podes recuperar o acesso pelo email ou numero de celular registado.
          </Text>
          <CustomButton title="Alterar senha" onPress={salvarPerfil} loading={savingPerfil} style={{ marginTop: 4 }} />
        </View>

        {/* Configuracoes de calculo */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calculator-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Calculo de precos</Text>
          </View>

          <View style={styles.moedaBox}>
            <Ionicons name="cash-outline" size={18} color={colors.primary} />
            <Text style={styles.moedaText}>Metical (MT) — Mocambique</Text>
          </View>

          <CustomInput
            label="Margem de lucro padrao (%)"
            value={margem} onChangeText={setMargem}
            keyboardType="numeric" placeholder="Ex: 30"
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Activar arredondamento</Text>
            <Switch value={arredondamento} onValueChange={setArredondamento}
              trackColor={{ true: colors.primary }} />
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
          <CustomButton title="Guardar configuracoes" onPress={salvarConfig} loading={savingConfig} style={{ marginTop: 8 }} />
        </View>

        {/* Sobre */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutApp}>Quanto Cobrar MZ</Text>
          <Text style={styles.aboutVersion}>Versao 1.0.0</Text>
          <Text style={styles.aboutSlogan}>Saiba quanto cobrar. Venda sem prejuizo.</Text>
          <View style={styles.divider} />
          <Text style={styles.aboutDev}>Desenvolvido por</Text>
          <Text style={styles.aboutDevName}>Ku_kulaDevz</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  moedaBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.inputBg, borderRadius: 10, padding: 12, marginBottom: 14,
  },
  moedaText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  switchLabel: { fontSize: 14, color: colors.text },
  tiposRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  tipoBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border,
  },
  tipoBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tipoBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tipoBtnTextActive: { color: '#fff' },
  senhaWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 14, top: 36 },
  senhaHint: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  aboutCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  aboutApp: { fontSize: 18, fontWeight: '800', color: colors.primary },
  aboutVersion: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  aboutSlogan: { fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  divider: { width: 40, height: 1, backgroundColor: colors.border, marginVertical: 12 },
  aboutDev: { fontSize: 12, color: colors.textSecondary },
  aboutDevName: { fontSize: 15, fontWeight: '800', color: colors.primaryDark, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.error + '12', borderRadius: 14, paddingVertical: 14, marginBottom: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: colors.error },
});
