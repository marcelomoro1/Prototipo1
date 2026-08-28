import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUTOS } from "../data/products.js";
import { gerarId } from "../utils/format.js";

const SEED = PRODUTOS.map((p) => ({ ativo: true, ...p }));

export const useProductsStore = create(
  persist(
    (set, get) => ({
      produtos: SEED,

      listarAtivos: () => get().produtos.filter((p) => p.ativo),

      buscarPorId: (id) => get().produtos.find((p) => p.id === id),

      criar: (dados) => {
        const novo = {
          id: dados.id?.trim() || gerarId("produto"),
          ativo: true,
          variantes: [],
          personalizacao: null,
          avaliacaoMedia: 0,
          numeroAvaliacoes: 0,
          destaque: false,
          maisVendido: false,
          tags: [],
          ...dados,
        };
        set((s) => ({ produtos: [novo, ...s.produtos] }));
        return novo;
      },

      atualizar: (id, dados) => {
        set((s) => ({
          produtos: s.produtos.map((p) => (p.id === id ? { ...p, ...dados } : p)),
        }));
      },

      alternarAtivo: (id) => {
        set((s) => ({
          produtos: s.produtos.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)),
        }));
      },

      ajustarEstoque: (id, quantidade) => {
        set((s) => ({
          produtos: s.produtos.map((p) =>
            p.id === id ? { ...p, estoque: Math.max(0, p.estoque - quantidade) } : p
          ),
        }));
      },

      registrarAvaliacao: (id, nota) => {
        set((s) => ({
          produtos: s.produtos.map((p) => {
            if (p.id !== id) return p;
            const total = p.numeroAvaliacoes + 1;
            const media = (p.avaliacaoMedia * p.numeroAvaliacoes + nota) / total;
            return { ...p, numeroAvaliacoes: total, avaliacaoMedia: Number(media.toFixed(2)) };
          }),
        }));
      },
    }),
    { name: "as-produtos-v2" }
  )
);
