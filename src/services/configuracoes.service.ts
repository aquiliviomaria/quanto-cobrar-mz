import { getDatabase } from '../database/db';
import { Configuracoes } from '../types/common.types';

export async function getConfiguracoes(): Promise<Configuracoes> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<any>('SELECT * FROM configuracoes WHERE id = 1');
  return {
    id: row.id,
    moeda: row.moeda,
    margem_padrao: row.margem_padrao,
    arredondamento_ativo: row.arredondamento_ativo === 1,
    tipo_arredondamento: row.tipo_arredondamento,
  };
}

export async function updateConfiguracoes(config: Partial<Configuracoes>): Promise<void> {
  const db = await getDatabase();
  if (config.margem_padrao !== undefined) {
    await db.runAsync('UPDATE configuracoes SET margem_padrao=?, updated_at=CURRENT_TIMESTAMP WHERE id=1', [config.margem_padrao]);
  }
  if (config.arredondamento_ativo !== undefined) {
    await db.runAsync('UPDATE configuracoes SET arredondamento_ativo=?, updated_at=CURRENT_TIMESTAMP WHERE id=1', [config.arredondamento_ativo ? 1 : 0]);
  }
  if (config.tipo_arredondamento !== undefined) {
    await db.runAsync('UPDATE configuracoes SET tipo_arredondamento=?, updated_at=CURRENT_TIMESTAMP WHERE id=1', [config.tipo_arredondamento]);
  }
}
