import { Link } from "react-router-dom";
import { Typography, Grid, Paper, Stack, Box, Chip } from "@mui/material";
import Money from "../../components/common/Money.jsx";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useOrdersStore } from "../../store/useOrdersStore.js";
import { useUsersStore } from "../../store/useUsersStore.js";
import { formatarData } from "../../utils/format.js";

function visualizacoesMock(id) {
  const semente = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return 120 + (semente % 40) * 11;
}

const STATUS_COLOR = { processando: "warning", enviado: "secondary", entregue: "success", cancelado: "error" };

export default function AdminDashboardPage() {
  const produtos = useProductsStore((s) => s.produtos);
  const pedidos = useOrdersStore((s) => s.pedidos);
  const usuarios = useUsersStore((s) => s.usuarios);

  const maisVendidos = [...produtos].sort((a, b) => Number(b.maisVendido) - Number(a.maisVendido)).slice(0, 5);
  const maisVistos = [...produtos].sort((a, b) => visualizacoesMock(b.id) - visualizacoesMock(a.id)).slice(0, 5);
  const recentes = [...pedidos].sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1)).slice(0, 6);

  const hoje = new Date().toISOString().slice(0, 10);
  const inicioSemana = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const inicioMes = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const faturamento = (desde) => pedidos.filter((p) => p.criadoEm >= desde && p.status !== "cancelado").reduce((s, p) => s + p.total, 0);

  function nomeCliente(userId) {
    return usuarios.find((u) => u.id === userId)?.nome || "Cliente";
  }

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visão geral da loja
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {[
          { label: "Faturamento hoje", valor: faturamento(hoje) },
          { label: "Últimos 7 dias", valor: faturamento(inicioSemana) },
          { label: "Últimos 30 dias", valor: faturamento(inicioMes) },
          { label: "Pedidos totais", valor: pedidos.length, moeda: false },
        ].map((c) => (
          <Grid key={c.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Typography variant="overline" color="text.secondary">
                {c.label}
              </Typography>
              {c.moeda === false ? (
                <Typography variant="h5">{c.valor}</Typography>
              ) : (
                <Money value={c.valor} variant="h5" />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Produtos mais vendidos
            </Typography>
            <Stack divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />} spacing={1.5}>
              {maisVendidos.map((p) => (
                <Stack key={p.id} direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography component={Link} to={`/admin/produtos/${p.id}/editar`} variant="body2">
                    {p.nome}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.numeroAvaliacoes} avaliações
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Produtos mais visualizados
            </Typography>
            <Stack divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />} spacing={1.5}>
              {maisVistos.map((p) => (
                <Stack key={p.id} direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography component={Link} to={`/admin/produtos/${p.id}/editar`} variant="body2">
                    {p.nome}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {visualizacoesMock(p.id)} acessos
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Pedidos recentes
          </Typography>
          <Typography component={Link} to="/admin/pedidos" variant="body2">
            Ver todos
          </Typography>
        </Stack>
        {recentes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum pedido registrado ainda.
          </Typography>
        ) : (
          <Stack divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />} spacing={1.5}>
            {recentes.map((p) => (
              <Stack key={p.id} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography component={Link} to={`/admin/pedidos/${p.id}`} variant="body2" sx={{ fontWeight: 600 }}>
                    #{p.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {nomeCliente(p.userId)} · {formatarData(p.criadoEm)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Chip size="small" label={p.status} color={STATUS_COLOR[p.status]} variant="outlined" />
                  <Money value={p.total} variant="body2" sx={{ fontWeight: 600 }} />
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
