import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/screens/onboarding/SplashScreen';
import { useAppStore } from './src/store/useAppStore';
import { getDatabase } from './src/database/db';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const loadConfiguracoes = useAppStore(s => s.loadConfiguracoes);

  useEffect(() => {
    async function init() {
      await getDatabase();
      await loadConfiguracoes();
      setDbReady(true);
    }
    init();
  }, []);

  if (showSplash || !dbReady) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
