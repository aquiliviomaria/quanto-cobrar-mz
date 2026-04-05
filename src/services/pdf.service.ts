import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { formatMT } from '../utils/currency';
import { LOGO_QCMZ_B64, LOGO_KUKU_B64 } from '../assets/logoBase64';

interface DadosRecibo {
  empresa?: string;
  telefone?: string;
  clienteNome?: string;
  produtoNome: string;
  quantidade: number;
  descricaoPedido?: string;
  custoTotal: number;
  valorLucro: number;
  margem: number;
  precoSugerido: number;
  precoFinal: number;
  data: string;
}

export async function gerarEPartilharPDF(dados: DadosRecibo): Promise<void> {
  const html = gerarHTML(dados);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const podePartilhar = await Sharing.isAvailableAsync();
  if (podePartilhar) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Partilhar Orcamento',
      UTI: 'com.adobe.pdf',
    });
  }
}

function gerarHTML(d: DadosRecibo): string {
  const empresa = d.empresa || 'Quanto Cobrar MZ';
  const dataFormatada = new Date(d.data).toLocaleDateString('pt-MZ', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1A1A2E; background: #fff; padding: 40px; }
    .header { border-bottom: 3px solid #1F8A70; padding-bottom: 20px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; }
    .empresa-nome { font-size: 22px; font-weight: 800; color: #1F8A70; }
    .empresa-info { font-size: 12px; color: #6B7280; margin-top: 4px; line-height: 1.6; }
    .titulo-doc { text-align: right; }
    .titulo-doc h1 { font-size: 28px; font-weight: 900; color: #1F8A70; letter-spacing: 2px; }
    .titulo-doc .data { font-size: 12px; color: #6B7280; margin-top: 4px; }
    .cliente-section { background: #F8FAFC; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; }
    .cliente-section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 6px; }
    .cliente-nome { font-size: 16px; font-weight: 700; color: #1A1A2E; }
    .produto-section { margin-bottom: 24px; }
    .produto-section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 10px; }
    .produto-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #E5E7EB; }
    .produto-row:last-child { border-bottom: none; }
    .produto-label { font-size: 14px; color: #6B7280; }
    .produto-val { font-size: 14px; font-weight: 600; color: #1A1A2E; }
    .descricao-box { background: #F8FAFC; border-left: 3px solid #1F8A70; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
    .descricao-box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 6px; }
    .descricao-box p { font-size: 13px; color: #1A1A2E; line-height: 1.6; }
    .total-section { background: #1F8A70; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .total-label { font-size: 13px; color: rgba(255,255,255,0.8); }
    .total-val { font-size: 13px; font-weight: 600; color: #fff; }
    .total-final { border-top: 1px solid rgba(255,255,255,0.3); padding-top: 12px; margin-top: 8px; }
    .total-final .total-label { font-size: 15px; font-weight: 700; color: #fff; }
    .total-final .total-val { font-size: 22px; font-weight: 900; color: #F4B400; }
    .nota { font-size: 12px; color: #6B7280; text-align: center; margin-bottom: 28px; line-height: 1.6; }
    .footer { border-top: 1px solid #E5E7EB; padding-top: 20px; display: flex; justify-content: space-around; align-items: flex-start; }
    .footer-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .footer-logo { width: 52px; height: 52px; object-fit: contain; }
    .footer-kuku { width: 52px; height: 52px; object-fit: contain; }
    .footer-label { font-size: 10px; color: #9CA3AF; text-align: center; }
    .footer-name-qcmz { font-size: 13px; font-weight: 800; color: #1F8A70; text-align: center; }
    .footer-name-kuku { font-size: 13px; font-weight: 800; color: #146356; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="empresa-nome">${empresa}</div>
      <div class="empresa-info">
        ${d.telefone ? `Tel: ${d.telefone}<br/>` : ''}
        Mocambique
      </div>
    </div>
    <div class="titulo-doc">
      <h1>ORCAMENTO</h1>
      <div class="data">${dataFormatada}</div>
    </div>
  </div>

  ${d.clienteNome ? `
  <div class="cliente-section">
    <h3>Cliente</h3>
    <div class="cliente-nome">${d.clienteNome}</div>
  </div>
  ` : ''}

  <div class="produto-section">
    <h3>Detalhes do produto</h3>
    <div class="produto-row">
      <span class="produto-label">Produto</span>
      <span class="produto-val">${d.produtoNome}</span>
    </div>
    <div class="produto-row">
      <span class="produto-label">Quantidade</span>
      <span class="produto-val">${d.quantidade}</span>
    </div>
  </div>

  ${d.descricaoPedido ? `
  <div class="descricao-box">
    <h3>Descricao do pedido</h3>
    <p>${d.descricaoPedido}</p>
  </div>
  ` : ''}

  <div class="total-section">
    <div class="total-row total-final">
      <span class="total-label">TOTAL</span>
      <span class="total-val">${formatMT(d.precoFinal)}</span>
    </div>
  </div>

  <div class="footer">
    <div class="footer-col">
      <span class="footer-label">Gerado por</span>
      <img src="${LOGO_QCMZ_B64}" class="footer-logo" alt="logo qcmz" />
      <span class="footer-name-qcmz">Quanto Cobrar MZ</span>
    </div>
    <div class="footer-col">
      <span class="footer-label">Desenvolvido por</span>
      <img src="${LOGO_KUKU_B64}" class="footer-kuku" alt="kukuladevz" />
      <span class="footer-name-kuku">Ku_kulaDevz</span>
    </div>
  </div>
</body>
</html>`;
}
