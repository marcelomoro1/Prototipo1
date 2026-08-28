import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import EmptyState from "../../components/common/EmptyState.jsx";
import Money from "../../components/common/Money.jsx";
import ProductThumb from "../../components/common/ProductThumb.jsx";
import { useCartStore } from "../../store/useCartStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useToastStore } from "../../store/useToastStore.js";
import { useProductsStore } from "../../store/useProductsStore.js";
import { calcularOpcoesFrete, formatarCep, cepValido } from "../../utils/shipping.js";

export default function CartPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const itens = useCartStore((s) => s.itens);
  const produtos = useProductsStore((s) => s.produtos);
  const cupom = useCartStore((s) => s.cupom);
  const alterarQuantidade = useCartStore((s) => s.alterarQuantidade);
  const remover = useCartStore((s) => s.remover);
  const aplicarCupom = useCartStore((s) => s.aplicarCupom);
  const removerCupom = useCartStore((s) => s.removerCupom);
  const subtotal = useCartStore((s) => s.subtotal());
  const descontoCupom = useCartStore((s) => s.descontoCupom());
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [codigoCupom, setCodigoCupom] = useState("");
  const [cep, setCep] = useState("");
  const opcoesFrete = useMemo(() => calcularOpcoesFrete(cep), [cep]);
  const freteEstimado = opcoesFrete[0]?.custo ?? 0;
  const freteGratis = cupom?.tipo === "frete";

  const total = subtotal - descontoCupom + (freteGratis ? 0 : freteEstimado);

  function handleCupom(e) {
    e.preventDefault();
    const r = aplicarCupom(codigoCupom);
    if (!r.ok) mostrarToast(r.erro, "error");
    else mostrarToast(`Cupom ${r.cupom.codigo} aplicado: ${r.cupom.descricao}.`);
  }

  function irParaCheckout() {
    if (!userId) {
      navigate("/entrar", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  }

  if (itens.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <EmptyState
          title="Seu carrinho está vazio"
          description="Adicione peças da nossa loja para continuar."
          actionLabel="Ver catálogo"
          actionTo="/produtos"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Carrinho
      </Typography>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack divider={<Divider />} spacing={3}>
            {itens.map((item) => (
              <Stack key={item.id} direction="row" spacing={2}>
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    border: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <ProductThumb
                    imagem={produtos.find((p) => p.id === item.produtoId)?.imagem}
                    subcategoria={item.subcategoria}
                    alt={item.nome}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    component={Link}
                    to={`/produto/${item.produtoId}`}
                    variant="subtitle2"
                    sx={{ fontWeight: 600 }}
                  >
                    {item.nome}
                  </Typography>
                  {item.variantesLabel && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {item.variantesLabel}
                    </Typography>
                  )}
                  {item.personalizacaoTexto && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      Personalização: "{item.personalizacaoTexto}"
                    </Typography>
                  )}

                  <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 1.5 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantidade}
                      onChange={(e) => alterarQuantidade(item.id, Math.max(1, Number(e.target.value) || 1))}
                      sx={{ width: 80 }}
                      slotProps={{ htmlInput: { min: 1 } }}
                    />
                    <Button size="small" color="inherit" onClick={() => remover(item.id)}>
                      Remover
                    </Button>
                  </Stack>
                </Box>

                <Money value={item.precoUnitario * item.quantidade} variant="subtitle1" sx={{ fontWeight: 700 }} />
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ border: "1px solid", borderColor: "divider", p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Resumo do pedido
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Money value={subtotal} variant="body2" />
              </Stack>
              {cupom && (
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Cupom {cupom.codigo}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {cupom.tipo === "percentual" ? `− ${cupom.valor}%` : "frete grátis"}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Frete estimado
                </Typography>
                <Typography variant="body2">
                  {freteGratis ? "Grátis" : cep ? <Money value={freteEstimado} /> : "informe o CEP"}
                </Typography>
              </Stack>
            </Stack>

            <TextField
              fullWidth
              size="small"
              label="CEP para estimar o frete"
              value={cep}
              onChange={(e) => setCep(formatarCep(e.target.value))}
              helperText={cep && !cepValido(cep) ? "CEP incompleto" : " "}
              sx={{ mb: 2 }}
            />

            <Box component="form" onSubmit={handleCupom} sx={{ display: "flex", gap: 1, mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Cupom de desconto"
                value={codigoCupom}
                onChange={(e) => setCodigoCupom(e.target.value)}
              />
              <Button type="submit" variant="outlined">
                Aplicar
              </Button>
            </Box>
            {cupom && (
              <Button size="small" color="inherit" onClick={removerCupom} sx={{ mb: 2 }}>
                Remover cupom
              </Button>
            )}

            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Money value={Math.max(0, total)} variant="subtitle1" sx={{ fontWeight: 700 }} />
            </Stack>

            <Button variant="contained" size="large" fullWidth onClick={irParaCheckout}>
              Ir para o checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
