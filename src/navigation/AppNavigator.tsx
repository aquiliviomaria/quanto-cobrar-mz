import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { HomeScreen } from '../screens/home/HomeScreen';
import { InsumosListScreen } from '../screens/insumos/InsumosListScreen';
import { AddInsumoScreen } from '../screens/insumos/AddInsumoScreen';
import { ProdutosListScreen } from '../screens/produtos/ProdutosListScreen';
import { AddProdutoScreen } from '../screens/produtos/AddProdutoScreen';
import { NovoOrcamentoScreen } from '../screens/orcamentos/NovoOrcamentoScreen';
import { ResultadoOrcamentoScreen } from '../screens/orcamentos/ResultadoOrcamentoScreen';
import { HistoricoOrcamentosScreen } from '../screens/orcamentos/HistoricoOrcamentosScreen';
import { ConfigScreen } from '../screens/configuracoes/ConfigScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { borderTopColor: colors.border, paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Início', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
      />
      <Tab.Screen
        name="InsumosList"
        component={InsumosListScreen}
        options={{ tabBarLabel: 'Insumos', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛒</Text> }}
      />
      <Tab.Screen
        name="ProdutosList"
        component={ProdutosListScreen}
        options={{ tabBarLabel: 'Produtos', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎂</Text> }}
      />
      <Tab.Screen
        name="Historico"
        component={HistoricoOrcamentosScreen}
        options={{ tabBarLabel: 'Histórico', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }}
      />
      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{ tabBarLabel: 'Config', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text> }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="AddInsumo" component={AddInsumoScreen} />
        <Stack.Screen name="AddProduto" component={AddProdutoScreen} />
        <Stack.Screen name="NovoOrcamento" component={NovoOrcamentoScreen} />
        <Stack.Screen name="ResultadoOrcamento" component={ResultadoOrcamentoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
