import { create } from 'zustand';
import { Orcamento, OrcamentoInput } from '../types/orcamento.types';
import * as svc from '../services/orcamentos.service';

interface OrcamentosStore {
  orcamentos: Orcamento[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: OrcamentoInput) => Promise<number>;
  updateStatus: (id: number, status: string) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useOrcamentosStore = create<OrcamentosStore>((set, get) => ({
  orcamentos: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const orcamentos = await svc.getAllOrcamentos();
    set({ orcamentos, loading: false });
  },

  create: async (input) => {
    const id = await svc.createOrcamento(input);
    await get().load();
    return id;
  },

  updateStatus: async (id, status) => {
    await svc.updateOrcamentoStatus(id, status);
    await get().load();
  },

  remove: async (id) => {
    await svc.deleteOrcamento(id);
    await get().load();
  },
}));
