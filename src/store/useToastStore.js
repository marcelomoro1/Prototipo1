import { create } from "zustand";

export const useToastStore = create((set) => ({
  mensagem: "",
  severidade: "success",
  aberto: false,

  mostrar: (mensagem, severidade = "success") => set({ mensagem, severidade, aberto: true }),
  fechar: () => set({ aberto: false }),
}));
