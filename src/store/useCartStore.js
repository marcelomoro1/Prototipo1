import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gerarId } from "../utils/format.js";
import { buscarCupom } from "../data/coupons.js";

function mesmaConfiguracao(a, b) {
  return (
    a.produtoId === b.produtoId &&
    JSON.stringify(a.variantesEscolhidas) === JSON.stringify(b.variantesEscolhidas) &&
    (a.personalizacaoTexto || "") === (b.personalizacaoTexto || "")
  );
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      itens: [],
      cupom: null,

      adicionar: (item) => {
        set((s) => {
          const existente = s.itens.find((i) => mesmaConfiguracao(i, item));
          if (existente) {
            return {
              itens: s.itens.map((i) =>
                i.id === existente.id ? { ...i, quantidade: i.quantidade + item.quantidade } : i
              ),
            };
          }
          return { itens: [...s.itens, { ...item, id: gerarId("cart") }] };
        });
      },

      alterarQuantidade: (id, quantidade) => {
        if (quantidade <= 0) {
          get().remover(id);
          return;
        }
        set((s) => ({
          itens: s.itens.map((i) => (i.id === id ? { ...i, quantidade } : i)),
        }));
      },

      remover: (id) => set((s) => ({ itens: s.itens.filter((i) => i.id !== id) })),

      limpar: () => set({ itens: [], cupom: null }),

      aplicarCupom: (codigo) => {
        const cupom = buscarCupom(codigo);
        if (!cupom) return { ok: false, erro: "Cupom inválido ou expirado." };
        set({ cupom });
        return { ok: true, cupom };
      },

      removerCupom: () => set({ cupom: null }),

      subtotal: () => get().itens.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0),

      totalItens: () => get().itens.reduce((s, i) => s + i.quantidade, 0),

      descontoCupom: () => {
        const { cupom } = get();
        if (!cupom || cupom.tipo !== "percentual") return 0;
        return (get().subtotal() * cupom.valor) / 100;
      },
    }),
    { name: "as-carrinho" }
  )
);
