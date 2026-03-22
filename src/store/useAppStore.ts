import { create } from 'zustand';
import { Configuracoes } from '../types/common.types';
import { getConfiguracoes, updateConfiguracoes } from '../services/configuracoes.service';

interface AppStore {
  configuracoes: Configuracoes | null;
  loadConfiguracoes: () => Promise<void>;
  saveConfiguracoes: (config: Partial<Configuracoes>) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  configuracoes: null,

  loadConfiguracoes: async () => {
    const config = await getConfiguracoes();
    set({ configuracoes: config });
  },

  saveConfiguracoes: async (config) => {
    await updateConfiguracoes(config);
    await get().loadConfiguracoes();
  },
}));
