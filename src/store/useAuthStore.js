import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUsersStore } from "./useUsersStore.js";

export const useAuthStore = create(
  persist(
    (set) => ({
      userId: null,
      role: null, // "cliente" | "admin"

      login: (email, senha) => {
        const resultado = useUsersStore.getState().autenticar(email, senha);
        if (!resultado.ok) return resultado;
        set({ userId: resultado.usuario.id, role: resultado.usuario.role });
        return resultado;
      },

      loginSocial: (nome, email) => {
        const usuario = useUsersStore.getState().loginSocialMock(nome, email);
        set({ userId: usuario.id, role: usuario.role });
        return usuario;
      },

      registrar: (dados) => {
        const resultado = useUsersStore.getState().registrar(dados);
        if (!resultado.ok) return resultado;
        set({ userId: resultado.usuario.id, role: resultado.usuario.role });
        return resultado;
      },

      logout: () => set({ userId: null, role: null }),
    }),
    { name: "as-auth" }
  )
);

export function useUsuarioAtual() {
  const userId = useAuthStore((s) => s.userId);
  return useUsersStore((s) => (userId ? s.usuarios.find((u) => u.id === userId) : null));
}
