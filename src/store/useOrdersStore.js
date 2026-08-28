import { create } from "zustand";
import { persist } from "zustand/middleware";
import { gerarId, hojeISO } from "../utils/format.js";

export const STATUS_PEDIDO = ["processando", "enviado", "entregue", "cancelado"];

const PEDIDOS_SEED = [];

export const useOrdersStore = create(
  persist(
    (set, get) => ({
      pedidos: PEDIDOS_SEED,

      listarPorUsuario: (userId) =>
        get()
          .pedidos.filter((p) => p.userId === userId)
          .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1)),

      buscarPorId: (id) => get().pedidos.find((p) => p.id === id),

      criar: (dados) => {
        const id = gerarId("pedido").toUpperCase();
        const pedido = {
          id,
          status: "processando",
          codigoRastreio: null,
          criadoEm: hojeISO(),
          historico: [{ status: "processando", data: hojeISO() }],
          ...dados,
        };
        set((s) => ({ pedidos: [pedido, ...s.pedidos] }));
        return pedido;
      },

      atualizarStatus: (id, status, codigoRastreio) => {
        set((s) => ({
          pedidos: s.pedidos.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  codigoRastreio: codigoRastreio !== undefined ? codigoRastreio : p.codigoRastreio,
                  historico: [...p.historico, { status, data: hojeISO() }],
                }
              : p
          ),
        }));
      },

      cancelar: (id) => get().atualizarStatus(id, "cancelado"),
    }),
    { name: "as-pedidos" }
  )
);
