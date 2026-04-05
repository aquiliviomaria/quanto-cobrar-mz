import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/onboarding/SplashScreen';
import { useAppStore } from './src/store/useAppStore';
import { initDatabase } from './src/database/db';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const loadConfiguracoes = useAppStore(s => s.loadConfiguracoes);

  useEffect(() => {
    async function init() {
      await initDatabase();
      await loadConfiguracoes();
      setDbReady(true);
    }
    init();
  }, []);

  // Só sai do splash quando AMBOS estiverem prontos
  const ready = splashDone && dbReady;

  return (
    <SafeAreaProvider>
      <StatusBar style={ready ? 'dark' : 'dark'} backgroundColor="#FFFFFF" />
      {!ready && <SplashScreen onFinish={() => setSplashDone(true)} />}
      {ready && <AppNavigator />}
    </SafeAreaProvider>
  );
}
