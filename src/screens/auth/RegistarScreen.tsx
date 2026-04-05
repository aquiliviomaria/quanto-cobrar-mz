import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme';

export function RegistarScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const register = useAuthStore(s => s.register);

  const handleRegistar = async () => {
    if (!nome || !email || !senha) { setErro('Nome, email e senha sao obrigatorios.'); return; }
    if (senha !== confirmar) { setErro('As senhas nao coincidem.'); return; }
    if (senha.length < 4) { setErro('A senha deve ter pelo menos 4 caracteres.'); return; }
    setErro(''); setLoading(true);
    try {
      await register(nome, email, senha, empresa, telefone);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={20}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={32} color="#fff" />
            </View>
            <Text style={styles.appName}>Criar conta</Text>
            <Text style={styles.subtitle}>Comeca a precificar correctamente</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Registar</Text>
            {erro ? (
              <View style={styles.erroBox}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                <Text style={styles.erroText}>{erro}</Text>
              </View>
            ) : null}
            <CustomInput required label="Nome completo" value={nome} onChangeText={setNome} placeholder="O teu nome" />
            <CustomInput required label="Email" value={email} onChangeText={setEmail} placeholder="o.teu@email.com" keyboardType="email-address" autoCapitalize="none" />
            <CustomInput label="Nome da empresa (opcional)" value={empresa} onChangeText={setEmpresa} placeholder="Ex: Confeitaria da Maria" />
            <CustomInput label="Telefone / Celular (opcional)" value={telefone} onChangeText={setTelefone} placeholder="Ex: +258 84 000 0000" keyboardType="phone-pad" />
            <View style={styles.senhaWrap}>
              <CustomInput required label="Senha" value={senha} onChangeText={setSenha} placeholder="Minimo 4 caracteres" secureTextEntry={!showSenha} />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowSenha(v => !v)}>
                <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <CustomInput required label="Confirmar senha" value={confirmar} onChangeText={setConfirmar} placeholder="Repete a senha" secureTextEntry={!showSenha} />
            <CustomButton title="Criar conta" onPress={handleRegistar} loading={loading} style={styles.btn} />
            <TouchableOpacity style={styles.linkRow} onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>Ja tens conta? </Text>
              <Text style={styles.link}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1 },
  header: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  backBtn: { position: 'absolute', left: 20, top: 20 },
  iconCircle: { width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  appName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  card: { flex: 1, backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 18 },
  erroBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.error + '15', borderRadius: 10, padding: 12, marginBottom: 14 },
  erroText: { fontSize: 13, color: colors.error, flex: 1 },
  senhaWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 14, top: 36 },
  btn: { marginTop: 8, marginBottom: 18 },
  linkRow: { flexDirection: 'row', justifyContent: 'center' },
  linkText: { fontSize: 14, color: colors.textSecondary },
  link: { fontSize: 14, color: colors.primary, fontWeight: '700' },
});
