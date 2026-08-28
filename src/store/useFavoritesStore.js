import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      porUsuario: {}, // { [userId]: string[] (produtoIds) }

      listar: (userId) => get().porUsuario[userId] || [],

      eFavorito: (userId, produtoId) => (get().porUsuario[userId] || []).includes(produtoId),

      alternar: (userId, produtoId) => {
        set((s) => {
          const atuais = s.porUsuario[userId] || [];
          const jaTem = atuais.includes(produtoId);
          const novaLista = jaTem ? atuais.filter((id) => id !== produtoId) : [...atuais, produtoId];
          return { porUsuario: { ...s.porUsuario, [userId]: novaLista } };
        });
      },

      remover: (userId, produtoId) => {
        set((s) => ({
          porUsuario: {
            ...s.porUsuario,
            [userId]: (s.porUsuario[userId] || []).filter((id) => id !== produtoId),
          },
        }));
      },
    }),
    { name: "as-favoritos" }
  )
);
