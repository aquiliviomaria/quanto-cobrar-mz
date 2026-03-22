import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💰</Text>
      <Text style={styles.title}>Quanto Cobrar MZ</Text>
      <Text style={styles.slogan}>Saiba quanto cobrar.{'\n'}Venda sem prejuízo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 12 },
  slogan: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
});
