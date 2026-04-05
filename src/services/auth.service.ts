import { getDatabase } from '../database/db';

export interface Utilizador {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
}

export async function registar(nome: string, email: string, senha: string, empresa?: string, telefone?: string): Promise<Utilizador> {
  const db = await getDatabase();
  const existe = await db.getFirstAsync<any>('SELECT id FROM utilizadores WHERE email = ?', [email]);
  if (existe) throw new Error('Este email ja esta registado.');
  const result = await db.runAsync(
    'INSERT INTO utilizadores (nome, email, senha, empresa, telefone) VALUES (?, ?, ?, ?, ?)',
    [nome.trim(), email.trim().toLowerCase(), senha, empresa?.trim() ?? null, telefone?.trim() ?? null]
  );
  return { id: result.lastInsertRowId, nome, email, empresa, telefone };
}

export async function entrar(email: string, senha: string): Promise<Utilizador> {
  const db = await getDatabase();
  const user = await db.getFirstAsync<any>(
    'SELECT id, nome, email, telefone, empresa FROM utilizadores WHERE email = ? AND senha = ?',
    [email.trim().toLowerCase(), senha]
  );
  if (!user) throw new Error('Email ou senha incorrectos.');
  return { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone, empresa: user.empresa };
}

export async function atualizarPerfil(id: number, dados: Partial<Utilizador & { senha?: string; senhaActual?: string }>): Promise<Utilizador> {
  const db = await getDatabase();
  if (dados.senha) {
    // Verificar senha actual
    const user = await db.getFirstAsync<any>('SELECT senha FROM utilizadores WHERE id = ?', [id]);
    if (user?.senha !== dados.senhaActual) throw new Error('Senha actual incorrecta.');
    await db.runAsync('UPDATE utilizadores SET senha = ? WHERE id = ?', [dados.senha, id]);
  }
  await db.runAsync(
    'UPDATE utilizadores SET nome = ?, telefone = ?, empresa = ? WHERE id = ?',
    [dados.nome ?? '', dados.telefone ?? null, dados.empresa ?? null, id]
  );
  const user = await db.getFirstAsync<any>('SELECT id, nome, email, telefone, empresa FROM utilizadores WHERE id = ?', [id]);
  return { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone, empresa: user.empresa };
}
