import { create } from 'zustand';
import { Insumo, InsumoInput } from '../types/insumo.types';
import * as svc from '../services/insumos.service';
import { useAuthStore } from './useAuthStore';

interface InsumosStore {
  insumos: Insumo[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: InsumoInput) => Promise<void>;
  update: (id: number, input: InsumoInput) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

function getUid(): number {
  return useAuthStore.getState().utilizador?.id ?? 1;
}

export const useInsumosStore = create<InsumosStore>((set, get) => ({
  insumos: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    const insumos = await svc.getAllInsumos(getUid());
    set({ insumos, loading: false });
  },

  create: async (input) => {
    await svc.createInsumo(input, getUid());
    await get().load();
  },

  update: async (id, input) => {
    await svc.updateInsumo(id, input, getUid());
    await get().load();
  },

  remove: async (id) => {
    await svc.deleteInsumo(id, getUid());
    await get().load();
  },
}));
