import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Share, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { CustomButton } from '../../components/common/CustomButton';
import { useOrcamentosStore } from '../../store/useOrcamentosStore';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme';
import { formatMT } from '../../utils/currency';
import { calcularMargens } from '../../services/calculadora.service';
import { gerarEPartilharPDF } from '../../services/pdf.service';

export function ResultadoOrcamentoScreen({ navigation, route }: any) {
  const { resultado, produto, quantidade, margem, clienteNome } = route.params;
  const { create } = useOrcamentosStore();
  const utilizador = useAuthStore(s => s.utilizador);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gerandoPDF, setGerandoPDF] = useState(false);
  const [modalPartilha, setModalPartilha] = useState(false);
  const [descricaoPedido, setDescricaoPedido] = useState('');

  const margens = calcularMargens(resultado.custo_total);
  const empresa = utilizador?.empresa || 'Quanto Cobrar MZ';
  const telefone = utilizador?.telefone || '';

  const guardar = async () => {
    setSaving(true);
    try {
      await create({
        cliente_nome: clienteNome || undefined,
        produto_id: produto.id,
        quantidade,
        margem_aplicada: margem,
        custo_total: resultado.custo_total,
        valor_lucro: resultado.valor_lucro,
        preco_sugerido: resultado.preco_sugerido,
        preco_arredondado: resultado.preco_arredondado,
        status: 'pendente',
        descricao_pedido: descricaoPedido || undefined,
      });
      setSaved(true);
      Alert.alert('Guardado', 'Orcamento guardado no historico com sucesso.');
    } finally {
      setSaving(false);
    }
  };

  const gerarMensagem = () => {
    const nomeCliente = clienteNome ? clienteNome : 'prezado(a) cliente';
    const qtdLabel = quantidade > 1
      ? `${quantidade} unidades de ${produto.nome}`
      : produto.nome;
    const desc = descricaoPedido
      ? `\n\nDetalhes do pedido:\n${descricaoPedido}`
      : '';
    const infoEmpresa = telefone ? `\nContacto: ${telefone}` : '';

    return (
      `Ola ${nomeCliente},\n\n` +
      `O orcamento para ${qtdLabel} ficou em ${formatMT(resultado.preco_arredondado)}.${desc}\n\n` +
      `Estamos a disposicao para qualquer duvida ou ajuste.\n\n` +
      `Atenciosamente,\n${empresa}${infoEmpresa}`
    );
  };

  const partilharMensagem = async () => {
    setModalPartilha(false);
    await Share.share({ message: gerarMensagem() });
  };

  const partilharPDF = async () => {
    setModalPartilha(false);
    setGerandoPDF(true);
    try {
      await gerarEPartilharPDF({
        empresa,
        telefone,
        clienteNome: clienteNome || undefined,
        produtoNome: produto.nome,
        quantidade,
        descricaoPedido: descricaoPedido || produto.descricao || undefined,
        custoTotal: resultado.custo_total,
        valorLucro: resultado.valor_lucro,
        margem,
        precoSugerido: resultado.preco_sugerido,
        precoFinal: resultado.preco_arredondado,
        data: new Date().toISOString(),
      });
    } catch (e) {
      Alert.alert('Erro', 'Nao foi possivel gerar o PDF.');
    } finally {
      setGerandoPDF(false);
    }
  };

  // Tamanho responsivo do preco final
  const precoStr = formatMT(resultado.preco_arredondado);
  const precoFontSize = precoStr.length > 12 ? 20 : precoStr.length > 9 ? 26 : 32;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Resultado" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Produto info */}
        <View style={styles.produtoCard}>
          <View style={styles.produtoCardTop}>
            <View style={styles.produtoIconWrap}>
              <Ionicons name="storefront-outline" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.produtoNome} numberOfLines={2}>{produto.nome}</Text>
              <Text style={styles.produtoSub}>Qtd: {quantidade} · Margem: {margem}%</Text>
              {clienteNome ? <Text style={styles.produtoSub}>Cliente: {clienteNome}</Text> : null}
            </View>
          </View>
        </View>

        {/* Descricao do pedido */}
        <View style={styles.descSection}>
          <Text style={styles.descLabel}>Descricao do pedido (opcional)</Text>
          <TextInput
            style={styles.descInput}
            value={descricaoPedido}
            onChangeText={setDescricaoPedido}
            placeholder="Ex: Bolo de chocolate com cobertura azul, topper com nome Ana, entrega sabado as 14h..."
            multiline
            numberOfLines={3}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Resultado principal */}
        <View style={styles.resultadoCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Custo total</Text>
            <Text style={styles.resultVal}>{formatMT(resultado.custo_total)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Lucro ({margem}%)</Text>
            <Text style={[styles.resultVal, { color: colors.success }]}>{formatMT(resultado.valor_lucro)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Preco sugerido</Text>
            <Text style={styles.resultVal}>{formatMT(resultado.preco_sugerido)}</Text>
          </View>
          <View style={[styles.destaque]}>
            <Text style={styles.destaqueLabel}>Preco recomendado</Text>
            <Text style={[styles.destaqueVal, { fontSize: precoFontSize }]} adjustsFontSizeToFit numberOfLines={1}>
              {formatMT(resultado.preco_arredondado)}
            </Text>
          </View>
        </View>

        {/* Comparacao de margens */}
        <Text style={styles.sectionTitle}>Comparacao de margens</Text>
        <View style={styles.margensCard}>
          {Object.entries(margens).map(([key, val]) => (
            <View key={key} style={styles.margemRow}>
              <Text style={styles.margemKey}>{key}</Text>
              <Text style={[styles.margemVal, key === `${margem}%` && styles.margemValActive]}>
                {formatMT(val)}
              </Text>
            </View>
          ))}
        </View>

        {/* Acoes */}
        <CustomButton
          title={saved ? 'Guardado no historico' : 'Guardar orcamento'}
          onPress={guardar}
          loading={saving}
          disabled={saved}
          style={styles.btn}
        />
        <TouchableOpacity
          style={styles.partilharBtn}
          onPress={() => setModalPartilha(true)}
          disabled={gerandoPDF}
        >
          <Ionicons name="share-social-outline" size={20} color="#fff" />
          <Text style={styles.partilharBtnText}>
            {gerandoPDF ? 'A gerar PDF...' : 'Partilhar orcamento'}
          </Text>
        </TouchableOpacity>
        <CustomButton
          title="Novo calculo"
          onPress={() => navigation.navigate('NovoOrcamento')}
          variant="secondary"
          style={styles.btn}
        />
      </ScrollView>

      {/* Modal de partilha */}
      <Modal visible={modalPartilha} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalPartilha(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Como queres partilhar?</Text>

            <TouchableOpacity style={styles.modalOption} onPress={partilharMensagem}>
              <View style={[styles.modalOptionIcon, { backgroundColor: '#25D366' + '20' }]}>
                <Ionicons name="chatbubble-outline" size={24} color="#25D366" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalOptionTitle}>Mensagem de texto</Text>
                <Text style={styles.modalOptionSub}>Envia via WhatsApp, SMS ou outro app</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.border} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={partilharPDF}>
              <View style={[styles.modalOptionIcon, { backgroundColor: colors.error + '20' }]}>
                <Ionicons name="document-text-outline" size={24} color={colors.error} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalOptionTitle}>Recibo em PDF</Text>
                <Text style={styles.modalOptionSub}>Gera um PDF profissional para partilhar</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.border} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalPartilha(false)}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20 },
  produtoCard: { backgroundColor: colors.primary, borderRadius: 14, padding: 16, marginBottom: 16 },
  produtoCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  produtoIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  produtoNome: { fontSize: 17, fontWeight: '800', color: '#fff' },
  produtoSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  descSection: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  descLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  descInput: {
    fontSize: 14, color: colors.text, backgroundColor: colors.inputBg,
    borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top',
  },
  resultadoCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
  },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  resultLabel: { fontSize: 14, color: colors.textSecondary },
  resultVal: { fontSize: 15, fontWeight: '600', color: colors.text },
  destaque: {
    backgroundColor: colors.primary + '12', borderRadius: 10,
    padding: 14, marginTop: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  destaqueLabel: { fontSize: 14, fontWeight: '700', color: colors.primary, flex: 1 },
  destaqueVal: { fontWeight: '900', color: colors.primary, flexShrink: 1, textAlign: 'right' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10 },
  margensCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  margemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  margemKey: { fontSize: 14, color: colors.textSecondary },
  margemVal: { fontSize: 14, fontWeight: '600', color: colors.text },
  margemValActive: { color: colors.primary, fontWeight: '800' },
  btn: { marginBottom: 10 },
  partilharBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#25D366', borderRadius: 12, paddingVertical: 14, marginBottom: 10,
  },
  partilharBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  modalOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 10,
  },
  modalOptionIcon: {
    width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  modalOptionTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  modalOptionSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cancelBtn: { marginTop: 8, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
});
