import { create } from "zustand";
import { persist } from "zustand/middleware";
import { USUARIOS_SEED, ENDERECOS_SEED } from "../data/users.js";
import { gerarId } from "../utils/format.js";

export const useUsersStore = create(
  persist(
    (set, get) => ({
      usuarios: USUARIOS_SEED,
      enderecos: ENDERECOS_SEED,

      buscarPorEmail: (email) =>
        get().usuarios.find((u) => u.email.toLowerCase() === String(email).toLowerCase()),

      buscarPorId: (id) => get().usuarios.find((u) => u.id === id),

      registrar: ({ nome, email, telefone, senha }) => {
        if (get().buscarPorEmail(email)) {
          return { ok: false, erro: "Já existe uma conta com esse e-mail." };
        }
        const novo = {
          id: gerarId("user"),
          nome,
          email,
          telefone,
          senha,
          role: "cliente",
          criadoEm: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ usuarios: [...s.usuarios, novo] }));
        return { ok: true, usuario: novo };
      },

      autenticar: (email, senha) => {
        const user = get().buscarPorEmail(email);
        if (!user || user.senha !== senha) {
          return { ok: false, erro: "E-mail ou senha inválidos." };
        }
        return { ok: true, usuario: user };
      },

      loginSocialMock: (nome, email) => {
        let user = get().buscarPorEmail(email);
        if (!user) {
          user = {
            id: gerarId("user"),
            nome,
            email,
            telefone: "",
            senha: gerarId("social"),
            role: "cliente",
            criadoEm: new Date().toISOString().slice(0, 10),
          };
          set((s) => ({ usuarios: [...s.usuarios, user] }));
        }
        return user;
      },

      atualizarPerfil: (id, dados) => {
        set((s) => ({
          usuarios: s.usuarios.map((u) => (u.id === id ? { ...u, ...dados } : u)),
        }));
      },

      alterarSenha: (id, senhaAtual, novaSenha) => {
        const user = get().buscarPorId(id);
        if (!user || user.senha !== senhaAtual) {
          return { ok: false, erro: "Senha atual incorreta." };
        }
        set((s) => ({
          usuarios: s.usuarios.map((u) => (u.id === id ? { ...u, senha: novaSenha } : u)),
        }));
        return { ok: true };
      },

      redefinirSenha: (email, novaSenha) => {
        const user = get().buscarPorEmail(email);
        if (!user) return { ok: false, erro: "Não encontramos uma conta com esse e-mail." };
        set((s) => ({
          usuarios: s.usuarios.map((u) => (u.id === user.id ? { ...u, senha: novaSenha } : u)),
        }));
        return { ok: true };
      },

      enderecosDoUsuario: (userId) => get().enderecos.filter((e) => e.userId === userId),

      salvarEndereco: (endereco) => {
        set((s) => {
          if (endereco.id) {
            return {
              enderecos: s.enderecos.map((e) => (e.id === endereco.id ? { ...e, ...endereco } : e)),
            };
          }
          const novo = { ...endereco, id: gerarId("end") };
          let lista = [...s.enderecos, novo];
          if (novo.principal) {
            lista = lista.map((e) =>
              e.userId === novo.userId && e.id !== novo.id ? { ...e, principal: false } : e
            );
          }
          return { enderecos: lista };
        });
      },

      definirEnderecoPrincipal: (userId, enderecoId) => {
        set((s) => ({
          enderecos: s.enderecos.map((e) =>
            e.userId === userId ? { ...e, principal: e.id === enderecoId } : e
          ),
        }));
      },

      removerEndereco: (enderecoId) => {
        set((s) => ({ enderecos: s.enderecos.filter((e) => e.id !== enderecoId) }));
      },
    }),
    { name: "as-usuarios" }
  )
);
