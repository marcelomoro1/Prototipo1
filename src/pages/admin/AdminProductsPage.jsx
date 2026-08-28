import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Switch,
} from "@mui/material";
import Money from "../../components/common/Money.jsx";
import ProductThumb from "../../components/common/ProductThumb.jsx";
import { useProductsStore } from "../../store/useProductsStore.js";
import { precoMinimo } from "../../data/products.js";

export default function AdminProductsPage() {
  const produtos = useProductsStore((s) => s.produtos);
  const alternarAtivo = useProductsStore((s) => s.alternarAtivo);
  const [busca, setBusca] = useState("");

  const lista = produtos.filter((p) =>
    `${p.nome} ${p.categoria} ${p.subcategoria}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4">Produtos</Typography>
          <Typography variant="body2" color="text.secondary">
            {produtos.length} produto(s) cadastrados
          </Typography>
        </Box>
        <Button component={Link} to="/admin/produtos/novo" variant="contained">
          Novo produto
        </Button>
      </Stack>

      <TextField
        placeholder="Buscar por nome ou categoria"
        size="small"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        sx={{ maxWidth: 360 }}
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 56 }} />
            <TableCell>Produto</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell align="right">Preço</TableCell>
            <TableCell align="right">Estoque</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lista.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell>
                <Box sx={{ width: 40, height: 40, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                  <ProductThumb imagem={p.imagem} subcategoria={p.subcategoria} alt={p.nome} />
                </Box>
              </TableCell>
              <TableCell>
                <Typography component={Link} to={`/admin/produtos/${p.id}/editar`} variant="body2" sx={{ fontWeight: 600 }}>
                  {p.nome}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {p.subcategoria}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Money value={precoMinimo(p)} variant="body2" />
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color={p.estoque === 0 ? "error.main" : "text.primary"}>
                  {p.estoque}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} sx={{ justifyContent: "center", alignItems: "center" }}>
                  <Switch size="small" checked={p.ativo} onChange={() => alternarAtivo(p.id)} />
                  <Chip size="small" label={p.ativo ? "Ativo" : "Inativo"} variant="outlined" color={p.ativo ? "success" : "default"} />
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Button size="small" component={Link} to={`/admin/produtos/${p.id}/editar`}>
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
