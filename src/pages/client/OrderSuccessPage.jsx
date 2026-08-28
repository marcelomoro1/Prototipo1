import { Link, useParams } from "react-router-dom";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import Money from "../../components/common/Money.jsx";
import { useOrdersStore } from "../../store/useOrdersStore.js";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const pedido = useOrdersStore((s) => s.buscarPorId(id));

  if (!pedido) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Pedido não encontrado
        </Typography>
        <Button component={Link} to="/" variant="outlined">
          Voltar à loja
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="overline" color="secondary.main">
        Pedido confirmado
      </Typography>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Obrigado pela compra!
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Seu pedido <strong>#{pedido.id}</strong> foi recebido e já está em processamento.
      </Typography>

      <Box sx={{ border: "1px solid", borderColor: "divider", p: 3, textAlign: "left", mb: 4 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Total
          </Typography>
          <Money value={pedido.total} variant="body2" sx={{ fontWeight: 700 }} />
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Pagamento
          </Typography>
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {pedido.metodoPagamento} · {pedido.pagamentoStatus}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Entrega estimada
          </Typography>
          <Typography variant="body2">{pedido.metodoEnvio?.prazoDias} dia(s) útil(is)</Typography>
        </Stack>
      </Box>

      <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
        <Button component={Link} to={`/pedidos/${pedido.id}`} variant="contained">
          Ver detalhes do pedido
        </Button>
        <Button component={Link} to="/produtos" variant="outlined">
          Continuar comprando
        </Button>
      </Stack>
    </Container>
  );
}
