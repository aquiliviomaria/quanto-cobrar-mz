import { create } from 'zustand';
import { Insumo, InsumoInput } from '../types/insumo.types';
import * as svc from '../services/insumos.service';

interface InsumosStore {
  insumos: Insumo[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: InsumoInput) => Promise<void>;
  update: (id: number, input: InsumoInput) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useInsumosStore = create<InsumosStore>((set, get) => ({
  insumos: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const insumos = await svc.getAllInsumos();
    set({ insumos, loading: false });
  },

  create: async (input) => {
    await svc.createInsumo(input);
    await get().load();
  },

  update: async (id, input) => {
    await svc.updateInsumo(id, input);
    await get().load();
  },

  remove: async (id) => {
    await svc.deleteInsumo(id);
    await get().load();
  },
}));
