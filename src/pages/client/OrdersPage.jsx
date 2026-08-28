import { Link } from "react-router-dom";
import { Container, Typography, Stack, Box, Chip } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import EmptyState from "../../components/common/EmptyState.jsx";
import Money from "../../components/common/Money.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useOrdersStore } from "../../store/useOrdersStore.js";
import { formatarData } from "../../utils/format.js";

const STATUS_LABEL = {
  processando: "Processando",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};
const STATUS_COLOR = {
  processando: "warning",
  enviado: "secondary",
  entregue: "success",
  cancelado: "error",
};

export default function OrdersPage() {
  const userId = useAuthStore((s) => s.userId);
  const pedidos = useOrdersStore(useShallow((s) => s.listarPorUsuario(userId)));

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Meus pedidos
      </Typography>

      {pedidos.length === 0 ? (
        <EmptyState
          title="Você ainda não fez nenhum pedido"
          description="Quando finalizar uma compra, ela aparece aqui."
          actionLabel="Ver catálogo"
          actionTo="/produtos"
        />
      ) : (
        <Stack spacing={2}>
          {pedidos.map((p) => (
            <Box
              key={p.id}
              component={Link}
              to={`/pedidos/${p.id}`}
              sx={{
                display: "block",
                border: "1px solid",
                borderColor: "divider",
                p: 2.5,
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Pedido #{p.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatarData(p.criadoEm)} · {p.itens.length} item(ns)
                  </Typography>
                </Box>
                <Stack spacing={1} sx={{ alignItems: "flex-end" }}>
                  <Chip size="small" label={STATUS_LABEL[p.status]} color={STATUS_COLOR[p.status]} variant="outlined" />
                  <Money value={p.total} variant="subtitle2" sx={{ fontWeight: 700 }} />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
}
