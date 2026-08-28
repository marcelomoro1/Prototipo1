import { create } from "zustand";

export const useCartDrawerStore = create((set) => ({
  aberto: false,
  abrir: () => set({ aberto: true }),
  fechar: () => set({ aberto: false }),
}));
