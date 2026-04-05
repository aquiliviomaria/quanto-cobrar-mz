import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/home/HomeScreen';
import { InsumosListScreen } from '../screens/insumos/InsumosListScreen';
import { AddInsumoScreen } from '../screens/insumos/AddInsumoScreen';
import { ProdutosListScreen } from '../screens/produtos/ProdutosListScreen';
import { AddProdutoScreen } from '../screens/produtos/AddProdutoScreen';
import { NovoOrcamentoScreen } from '../screens/orcamentos/NovoOrcamentoScreen';
import { ResultadoOrcamentoScreen } from '../screens/orcamentos/ResultadoOrcamentoScreen';
import { HistoricoOrcamentosScreen } from '../screens/orcamentos/HistoricoOrcamentosScreen';
import { ConfigScreen } from '../screens/configuracoes/ConfigScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegistarScreen } from '../screens/auth/RegistarScreen';
import { colors } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { ConversorScreen } from '../screens/conversor/ConversorScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="InsumosList"
        component={InsumosListScreen}
        options={{
          tabBarLabel: 'Insumos',
          tabBarIcon: ({ color, size }) => <Ionicons name="layers-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProdutosList"
        component={ProdutosListScreen}
        options={{
          tabBarLabel: 'Produtos',
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Historico"
        component={HistoricoOrcamentosScreen}
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{
          tabBarLabel: 'Config',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const utilizador = useAuthStore(s => s.utilizador);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {utilizador ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="AddInsumo" component={AddInsumoScreen} />
            <Stack.Screen name="AddProduto" component={AddProdutoScreen} />
            <Stack.Screen name="NovoOrcamento" component={NovoOrcamentoScreen} />
            <Stack.Screen name="ResultadoOrcamento" component={ResultadoOrcamentoScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registar" component={RegistarScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
