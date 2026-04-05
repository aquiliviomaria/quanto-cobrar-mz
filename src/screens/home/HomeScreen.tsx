import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useInsumosStore } from '../../store/useInsumosStore';
import { useProdutosStore } from '../../store/useProdutosStore';
import { useOrcamentosStore } from '../../store/useOrcamentosStore';
import { useAuthStore } from '../../store/useAuthStore';
const logoSource = require('../../assets/images/logo-qcmz.png');
const menuCards = [
  { icon: 'calculator-outline', label: 'Novo Orcamento', sub: 'Crie um calculo rapido', screen: 'NovoOrcamento', color: '#1F8A70', bg: '#E8F5F0' },
  { icon: 'storefront-outline', label: 'Produtos', sub: 'Gerencie os seus produtos', screen: 'ProdutosList', color: '#7C3AED', bg: '#F3EEFF' },
  { icon: 'layers-outline', label: 'Insumos', sub: 'Cadastre custos e materiais', screen: 'InsumosList', color: '#0EA5E9', bg: '#E0F4FF' },
  { icon: 'receipt-outline', label: 'Historico', sub: 'Veja orcamentos anteriores', screen: 'Historico', color: '#F59E0B', bg: '#FFF8E6' },
];
export function HomeScreen({ navigation }) {
  const insumos = useInsumosStore(s => s.insumos);
  const produtos = useProdutosStore(s => s.produtos);
  const orcamentos = useOrcamentosStore(s => s.orcamentos);
  const utilizador = useAuthStore(s => s.utilizador);
  useEffect(() => {
    useInsumosStore.getState().load();
    useProdutosStore.getState().load();
    useOrcamentosStore.getState().load();
  }, []);
  const nomeCompleto = utilizador?.nome ?? 'Utilizador';
  const primeiroNome = nomeCompleto.split(' ')[0];
  const inicial = primeiroNome.charAt(0).toUpperCase();
  const stats = [
    { label: 'Insumos', value: insumos.length, icon: 'layers-outline', color: '#0EA5E9', bg: '#E0F4FF', sub: insumos.length === 0 ? 'Nenhum cadastrado' : 'registados' },
    { label: 'Produtos', value: produtos.length, icon: 'storefront-outline', color: '#7C3AED', bg: '#F3EEFF', sub: produtos.length === 0 ? 'Comece agora' : 'registados' },
    { label: 'Orcamentos', value: orcamentos.length, icon: 'receipt-outline', color: '#1F8A70', bg: '#E8F5F0', sub: orcamentos.length === 0 ? 'Nenhum cadastrado' : 'realizados' },
  ];
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{inicial}</Text></View>
            <View style={styles.headerGreeting}>
              <Text style={styles.ola}>Ola, {primeiroNome}</Text>
              <Text style={styles.bemVindo}>Bem-vindo de volta</Text>
            </View>
            <Image source={logoSource} style={styles.logoImg} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>Quanto Cobrar MZ</Text>
          <Text style={styles.slogan}>Calcule o preco certo. Venda com lucro.</Text>
        </View>
        <View style={styles.statsRow}>
          {stats.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statNum}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>O QUE QUERES FAZER?</Text>
        <View style={styles.grid}>
          {menuCards.map((card, i) => (
            <TouchableOpacity key={card.screen} style={[styles.card, { borderLeftColor: card.color }, i===0 && styles.cardPrimary]} onPress={() => navigation.navigate(card.screen)} activeOpacity={0.8}>
              <View style={[styles.cardIconWrap, { backgroundColor: card.bg }]}>
                <Ionicons name={card.icon} size={24} color={card.color} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardLabel}>{card.label}</Text>
                <Text style={styles.cardSub}>{card.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F1F5F9'},
  scroll:{padding:16,paddingBottom:24},
  headerCard:{backgroundColor:'#EAF7F2',borderRadius:20,padding:14,marginBottom:16},
  headerTop:{flexDirection:'row',alignItems:'center',marginBottom:10},
  avatar:{width:38,height:38,borderRadius:19,backgroundColor:'#1F8A70',alignItems:'center',justifyContent:'center',marginRight:12},
  avatarText:{fontSize:16,fontWeight:'800',color:'#FFFFFF'},
  headerGreeting:{flex:1},
  ola:{fontSize:15,fontWeight:'700',color:'#1A1A2E'},
  bemVindo:{fontSize:13,color:'#6B7280',marginTop:1},
  logoImg:{width:90,height:90},
  appName:{fontSize:16,fontWeight:'800',color:'#1F8A70',marginBottom:4},
  slogan:{fontSize:12,color:'#4B5563',lineHeight:20},
  statsRow:{flexDirection:'row',gap:10,marginBottom:20},
  statCard:{flex:1,backgroundColor:'#FFFFFF',borderRadius:20,padding:14,alignItems:'center',elevation:2,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:6},
  statIconWrap:{width:44,height:44,borderRadius:14,alignItems:'center',justifyContent:'center',marginBottom:8},
  statNum:{fontSize:24,fontWeight:'800',color:'#1A1A2E'},
  statLabel:{fontSize:12,fontWeight:'600',color:'#374151',marginTop:2},
  statSub:{fontSize:10,color:'#9CA3AF',marginTop:2,textAlign:'center'},
  sectionTitle:{fontSize:11,fontWeight:'700',color:'#9CA3AF',letterSpacing:1.2,marginBottom:12},
  grid:{gap:10},
  card:{backgroundColor:'#FFFFFF',borderRadius:18,padding:16,flexDirection:'row',alignItems:'center',gap:14,borderLeftWidth:4,elevation:2,shadowColor:'#000',shadowOpacity:0.04,shadowRadius:6},
  cardPrimary:{shadowColor:'#1F8A70',shadowOpacity:0.12,shadowRadius:8,elevation:3},
  cardIconWrap:{width:48,height:48,borderRadius:14,alignItems:'center',justifyContent:'center'},
  cardText:{flex:1},
  cardLabel:{fontSize:16,fontWeight:'700',color:'#1A1A2E'},
  cardSub:{fontSize:12,color:'#9CA3AF',marginTop:2},
});
