import { useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Stack, Box, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import Money from "../../components/common/Money.jsx";
import { useOrdersStore, STATUS_PEDIDO } from "../../store/useOrdersStore.js";
import { useUsersStore } from "../../store/useUsersStore.js";
import { formatarData } from "../../utils/format.js";

const STATUS_COLOR = { processando: "warning", enviado: "secondary", entregue: "success", cancelado: "error" };

export default function AdminOrdersPage() {
  const pedidos = useOrdersStore((s) => s.pedidos);
  const usuarios = useUsersStore((s) => s.usuarios);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const lista = [...pedidos]
    .filter((p) => filtroStatus === "todos" || p.status === filtroStatus)
    .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));

  function nomeCliente(userId) {
    return usuarios.find((u) => u.id === userId)?.nome || "Cliente";
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Pedidos</Typography>
        <Typography variant="body2" color="text.secondary">
          {pedidos.length} pedido(s) no total
        </Typography>
      </Box>

      <TextField select size="small" label="Status" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} sx={{ maxWidth: 220 }}>
        <MenuItem value="todos">Todos</MenuItem>
        {STATUS_PEDIDO.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Pedido</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Data</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lista.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell>
                <Typography component={Link} to={`/admin/pedidos/${p.id}`} variant="body2" sx={{ fontWeight: 600 }}>
                  #{p.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {nomeCliente(p.userId)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatarData(p.criadoEm)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip size="small" label={p.status} color={STATUS_COLOR[p.status]} variant="outlined" />
              </TableCell>
              <TableCell align="right">
                <Money value={p.total} variant="body2" sx={{ fontWeight: 600 }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
