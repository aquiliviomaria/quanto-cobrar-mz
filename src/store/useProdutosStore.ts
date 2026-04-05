import { create } from 'zustand';
import { Produto, ProdutoInput } from '../types/produto.types';
import * as svc from '../services/produtos.service';
import { useAuthStore } from './useAuthStore';

interface ProdutosStore {
  produtos: Produto[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: ProdutoInput) => Promise<void>;
  update: (id: number, input: ProdutoInput) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

function getUid(): number {
  return useAuthStore.getState().utilizador?.id ?? 1;
}

export const useProdutosStore = create<ProdutosStore>((set, get) => ({
  produtos: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const produtos = await svc.getAllProdutos(getUid());
    set({ produtos, loading: false });
  },

  create: async (input) => {
    await svc.createProduto(input, getUid());
    await get().load();
  },

  update: async (id, input) => {
    await svc.updateProduto(id, input, getUid());
    await get().load();
  },

  remove: async (id) => {
    await svc.deleteProduto(id, getUid());
    await get().load();
  },
}));
