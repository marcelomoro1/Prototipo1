import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CATEGORIAS } from "../data/categories.js";
import { gerarId } from "../utils/format.js";

export const useCategoriesStore = create(
  persist(
    (set, get) => ({
      categorias: CATEGORIAS,

      criar: (nome) => {
        const slug = gerarId("cat");
        const nova = { slug, nome };
        set((s) => ({ categorias: [...s.categorias, nova] }));
        return nova;
      },

      renomear: (slug, nome) => {
        set((s) => ({
          categorias: s.categorias.map((c) => (c.slug === slug ? { ...c, nome } : c)),
        }));
      },

      remover: (slug) => {
        set((s) => ({ categorias: s.categorias.filter((c) => c.slug !== slug) }));
      },

      nomeDe: (slug) => get().categorias.find((c) => c.slug === slug)?.nome ?? slug,
    }),
    { name: "as-categorias" }
  )
);
