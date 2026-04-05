import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/common/CustomInput';
import { CustomButton } from '../../components/common/CustomButton';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme';

const logoSource = require('../../assets/images/logo-qcmz.png');

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const login = useAuthStore(s => s.login);

  const handleLogin = async () => {
    if (!email || !senha) { setErro('Preenche todos os campos.'); return; }
    setErro(''); setLoading(true);
    try {
      await login(email, senha);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === "android" ? 25 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header com logo */}
          <View style={styles.header}>
            <Image source={logoSource} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>Quanto Cobrar MZ</Text>
            <Text style={styles.subtitle}>Saiba quanto cobrar. Venda sem prejuízo.</Text>
          </View>

          {/* Formulário */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar</Text>

            {erro ? (
              <View style={styles.erroBox}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                <Text style={styles.erroText}>{erro}</Text>
              </View>
            ) : null}

            <CustomInput
              required label="Email" value={email} onChangeText={setEmail}
              placeholder="o.teu@email.com" keyboardType="email-address" autoCapitalize="none"
            />
            <View style={styles.senhaWrap}>
              <CustomInput
                required label="Senha" value={senha} onChangeText={setSenha}
                placeholder="A tua senha" secureTextEntry={!showSenha}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowSenha(v => !v)}>
                <Ionicons
                  name={showSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20} color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <CustomButton title="Entrar" onPress={handleLogin} loading={loading} style={styles.btn} />

            <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Registar')}>
              <Text style={styles.linkText}>Nao tens conta? </Text>
              <Text style={styles.link}>Registar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  header: {
    alignItems: 'center', paddingTop: 32, paddingBottom: 20, paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  logo: { width: 300, height: 250, marginBottom: 8 },
  appName: { fontSize: 24, fontWeight: '800', color: colors.primary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  card: {
    flex: 1, backgroundColor: colors.background,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingTop: 32,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 20 },
  erroBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.error + '15', borderRadius: 10, padding: 12, marginBottom: 16,
  },
  erroText: { fontSize: 13, color: colors.error, flex: 1 },
  senhaWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 14, top: 36 },
  btn: { marginTop: 8, marginBottom: 20 },
  linkRow: { flexDirection: 'row', justifyContent: 'center' },
  linkText: { fontSize: 14, color: colors.textSecondary },
  link: { fontSize: 14, color: colors.primary, fontWeight: '700' },
});
