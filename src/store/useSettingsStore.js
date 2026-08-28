import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      loja: {
        nome: "Artes e Sabores das Gurias",
        slogan: "Peças que transformam seu chimarrão em algo único",
        cidade: "Santa Maria - RS",
        whatsapp: "(55) 99999-0000",
        instagram: "@artesesaboresdasgurias",
        email: "contato@artesesabores.com.br",
        politicaTrocas:
          "Trocas e devoluções em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor.",
      },

      atualizarLoja: (dados) => set((s) => ({ loja: { ...s.loja, ...dados } })),
    }),
    { name: "as-configuracoes-v2" }
  )
);
