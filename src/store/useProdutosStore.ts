import { create } from 'zustand';
import { Produto, ProdutoInput } from '../types/produto.types';
import * as svc from '../services/produtos.service';

interface ProdutosStore {
  produtos: Produto[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: ProdutoInput) => Promise<void>;
  update: (id: number, input: ProdutoInput) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useProdutosStore = create<ProdutosStore>((set, get) => ({
  produtos: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const produtos = await svc.getAllProdutos();
    set({ produtos, loading: false });
  },

  create: async (input) => {
    await svc.createProduto(input);
    await get().load();
  },

  update: async (id, input) => {
    await svc.updateProduto(id, input);
    await get().load();
  },

  remove: async (id) => {
    await svc.deleteProduto(id);
    await get().load();
  },
}));
