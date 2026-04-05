import { create } from 'zustand';
import { Utilizador, registar, entrar, atualizarPerfil } from '../services/auth.service';

interface AuthStore {
  utilizador: Utilizador | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, empresa?: string, telefone?: string) => Promise<void>;
  updatePerfil: (dados: Partial<Utilizador & { senha?: string }>) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  utilizador: null,

  login: async (email, senha) => {
    const user = await entrar(email, senha);
    set({ utilizador: user });
  },

  register: async (nome, email, senha, empresa?, telefone?) => {
    const user = await registar(nome, email, senha, empresa, telefone);
    set({ utilizador: user });
  },

  updatePerfil: async (dados) => {
    const current = get().utilizador;
    if (!current) return;
    const updated = await atualizarPerfil(current.id, { ...current, ...dados });
    set({ utilizador: updated });
  },

  logout: () => {
    // Limpa os dados de todos os stores ao fazer logout
    set({ utilizador: null });
    // Reset stores para evitar que dados de uma conta apareçam noutra
    const { useInsumosStore } = require('./useInsumosStore');
    const { useProdutosStore } = require('./useProdutosStore');
    const { useOrcamentosStore } = require('./useOrcamentosStore');
    useInsumosStore.setState({ insumos: [] });
    useProdutosStore.setState({ produtos: [] });
    useOrcamentosStore.setState({ orcamentos: [] });
  },
}));
