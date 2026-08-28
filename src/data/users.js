// Usuários e endereços mockados (seed inicial das stores)

export const USUARIOS_SEED = [
  {
    id: "user-admin",
    nome: "Equipe Artes e Sabores",
    email: "admin@artesesabores.com.br",
    telefone: "(55) 99999-0000",
    senha: "admin123",
    role: "admin",
    criadoEm: "2025-11-01",
  },
  {
    id: "user-joao",
    nome: "João Ritter",
    email: "joao.ritter@ufn.edu.br",
    telefone: "(55) 99888-1234",
    senha: "123456",
    role: "cliente",
    criadoEm: "2026-02-10",
  },
];

export const ENDERECOS_SEED = [
  {
    id: "end-1",
    userId: "user-joao",
    apelido: "Casa",
    destinatario: "João Ritter",
    cep: "97015-000",
    logradouro: "Rua dos Andradas",
    numero: "1230",
    complemento: "Apto 302",
    bairro: "Centro",
    cidade: "Santa Maria",
    uf: "RS",
    principal: true,
  },
];
