import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AVALIACOES_SEED } from "../data/reviews.js";
import { gerarId, hojeISO } from "../utils/format.js";
import { useProductsStore } from "./useProductsStore.js";

export const useReviewsStore = create(
  persist(
    (set, get) => ({
      avaliacoes: AVALIACOES_SEED,

      doProduto: (produtoId, { incluirOcultas = false } = {}) =>
        get()
          .avaliacoes.filter((a) => a.produtoId === produtoId && (incluirOcultas || !a.oculto))
          .sort((a, b) => (a.data < b.data ? 1 : -1)),

      jaAvaliou: (userId, produtoId, pedidoId) =>
        get().avaliacoes.some(
          (a) => a.userId === userId && a.produtoId === produtoId && a.pedidoId === pedidoId
        ),

      criar: ({ produtoId, userId, usuarioNome, nota, comentario, pedidoId }) => {
        const nova = {
          id: gerarId("rev"),
          produtoId,
          userId,
          usuarioNome,
          nota,
          comentario,
          data: hojeISO(),
          pedidoId: pedidoId ?? null,
          oculto: false,
          respostaAdmin: null,
        };
        set((s) => ({ avaliacoes: [nova, ...s.avaliacoes] }));
        useProductsStore.getState().registrarAvaliacao(produtoId, nota);
        return nova;
      },

      editar: (id, dados) => {
        set((s) => ({
          avaliacoes: s.avaliacoes.map((a) => (a.id === id ? { ...a, ...dados } : a)),
        }));
      },

      excluir: (id) => set((s) => ({ avaliacoes: s.avaliacoes.filter((a) => a.id !== id) })),

      alternarOculto: (id) => {
        set((s) => ({
          avaliacoes: s.avaliacoes.map((a) => (a.id === id ? { ...a, oculto: !a.oculto } : a)),
        }));
      },

      responder: (id, resposta) => {
        set((s) => ({
          avaliacoes: s.avaliacoes.map((a) => (a.id === id ? { ...a, respostaAdmin: resposta } : a)),
        }));
      },
    }),
    { name: "as-avaliacoes" }
  )
);
