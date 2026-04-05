import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { colors } from '../../theme';

const logoSource = require('../../assets/images/logo-qcmz.png');

interface Props { onFinish: () => void; }

export function SplashScreen({ onFinish }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrada da logo
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    // Barra de progresso
    Animated.timing(progressAnim, {
      toValue: 1, duration: 2400, useNativeDriver: false,
    }).start();

    // Animação dos pontos
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    const t = setTimeout(onFinish, 2600);
    return () => clearTimeout(t);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View style={[
        styles.logoWrap,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }
      ]}>
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      {/* Texto */}
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.title}>Quanto Cobrar MZ</Text>
        <Text style={styles.slogan}>Saiba quanto cobrar. Venda sem prejuízo.</Text>
      </Animated.View>

      {/* Loading bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
        <Text style={styles.loadingText}>A carregar...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#EAF4FF',
    alignItems: 'center', justifyContent: 'center',
    gap: 16,
  },
  logoWrap: { alignItems: 'center' },
  logo: { width: 280, height: 280 },
  title: { fontSize: 26, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  slogan: { fontSize: 13, color: '#334155', textAlign: 'center', marginTop: 4 },
  progressContainer: { position: 'absolute', bottom: 60, width: '60%', alignItems: 'center', gap: 8 },
  progressTrack: {
    width: '100%', height: 4, backgroundColor: colors.border,
    borderRadius: 2, overflow: 'hidden',
  },
  progressBar: {
    height: '100%', backgroundColor: '#3B82F6', borderRadius: 2,
  },
  loadingText: { fontSize: 13, color: '#334155', fontWeight: '500' },
});
