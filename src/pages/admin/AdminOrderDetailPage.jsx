import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, Stack, Box, Grid, Paper, Divider, TextField, MenuItem, Button, Chip } from "@mui/material";
import Money from "../../components/common/Money.jsx";
import { useOrdersStore, STATUS_PEDIDO } from "../../store/useOrdersStore.js";
import { useUsersStore } from "../../store/useUsersStore.js";
import { useToastStore } from "../../store/useToastStore.js";
import { formatarData } from "../../utils/format.js";

const STATUS_COLOR = { processando: "warning", enviado: "secondary", entregue: "success", cancelado: "error" };

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const pedido = useOrdersStore((s) => s.buscarPorId(id));
  const atualizarStatus = useOrdersStore((s) => s.atualizarStatus);
  const usuarios = useUsersStore((s) => s.usuarios);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [status, setStatus] = useState(pedido?.status || "processando");
  const [codigoRastreio, setCodigoRastreio] = useState(pedido?.codigoRastreio || "");

  if (!pedido) {
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Pedido não encontrado
        </Typography>
        <Button component={Link} to="/admin/pedidos" variant="outlined">
          Voltar
        </Button>
      </Box>
    );
  }

  const cliente = usuarios.find((u) => u.id === pedido.userId);

  function salvar() {
    atualizarStatus(pedido.id, status, codigoRastreio || null);
    mostrarToast("Pedido atualizado.");
  }

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h4">Pedido #{pedido.id}</Typography>
          <Typography variant="body2" color="text.secondary">
            {cliente?.nome} · {cliente?.email} · {formatarData(pedido.criadoEm)}
          </Typography>
        </Box>
        <Chip label={pedido.status} color={STATUS_COLOR[pedido.status]} variant="outlined" />
      </Stack>

      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Itens
          </Typography>
          <Stack divider={<Divider />} spacing={1.5}>
            {pedido.itens.map((item, idx) => (
              <Stack key={idx} direction="row" sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2">{item.quantidade}× {item.nome}</Typography>
                  {item.variantesLabel && (
                    <Typography variant="caption" color="text.secondary">
                      {item.variantesLabel}
                    </Typography>
                  )}
                </Box>
                <Money value={item.precoUnitario * item.quantidade} variant="body2" />
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Endereço de entrega
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pedido.enderecoEntrega?.logradouro}, {pedido.enderecoEntrega?.numero} {pedido.enderecoEntrega?.complemento}
            <br />
            {pedido.enderecoEntrega?.bairro} — {pedido.enderecoEntrega?.cidade}/{pedido.enderecoEntrega?.uf}
            <br />
            CEP {pedido.enderecoEntrega?.cep}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Atualizar status
            </Typography>
            <Stack spacing={2}>
              <TextField select label="Status" size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_PEDIDO.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Código de rastreio"
                size="small"
                value={codigoRastreio}
                onChange={(e) => setCodigoRastreio(e.target.value)}
              />
              <Button variant="contained" onClick={salvar}>
                Salvar
              </Button>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Valores
            </Typography>
            <Stack spacing={0.75}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Money value={pedido.subtotal} variant="body2" />
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Frete ({pedido.metodoEnvio?.nome})
                </Typography>
                <Money value={pedido.frete} variant="body2" />
              </Stack>
              {pedido.desconto > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Desconto
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    − <Money value={pedido.desconto} component="span" />
                  </Typography>
                </Stack>
              )}
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="subtitle2">Total</Typography>
                <Money value={pedido.total} variant="subtitle2" sx={{ fontWeight: 700 }} />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Pagamento: {pedido.metodoPagamento} · {pedido.pagamentoStatus}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
