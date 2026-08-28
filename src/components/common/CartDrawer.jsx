import { Link, useNavigate } from "react-router-dom";
import { Drawer, Box, Typography, IconButton, Stack, Divider, Button } from "@mui/material";
import { X } from "lucide-react";
import Money from "./Money.jsx";
import EmptyState from "./EmptyState.jsx";
import ProductThumb from "./ProductThumb.jsx";
import { useCartDrawerStore } from "../../store/useCartDrawerStore.js";
import { useCartStore } from "../../store/useCartStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useProductsStore } from "../../store/useProductsStore.js";

export default function CartDrawer() {
  const navigate = useNavigate();
  const aberto = useCartDrawerStore((s) => s.aberto);
  const fechar = useCartDrawerStore((s) => s.fechar);

  const itens = useCartStore((s) => s.itens);
  const produtos = useProductsStore((s) => s.produtos);
  const alterarQuantidade = useCartStore((s) => s.alterarQuantidade);
  const remover = useCartStore((s) => s.remover);
  const subtotal = useCartStore((s) => s.subtotal());
  const descontoCupom = useCartStore((s) => s.descontoCupom());
  const cupom = useCartStore((s) => s.cupom);
  const userId = useAuthStore((s) => s.userId);

  const total = Math.max(0, subtotal - descontoCupom);

  function irParaCheckout() {
    fechar();
    if (!userId) {
      navigate("/entrar", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  }

  return (
    <Drawer anchor="right" open={aberto} onClose={fechar} slotProps={{ paper: { sx: { width: 400, maxWidth: "92vw" } } }}>
      <Stack sx={{ height: "100%" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6">Carrinho</Typography>
          <IconButton onClick={fechar} aria-label="Fechar" size="small">
            <X size={20} strokeWidth={1.75} />
          </IconButton>
        </Stack>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
          {itens.length === 0 ? (
            <EmptyState title="Seu carrinho está vazio" description="Adicione peças da loja para continuar." />
          ) : (
            <Stack divider={<Divider />} spacing={2}>
              {itens.map((item) => (
                <Stack key={item.id} direction="row" spacing={1.5}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
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

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {item.nome}
                    </Typography>
                    {item.variantesLabel && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                        {item.variantesLabel}
                      </Typography>
                    )}
                    <Stack direction="row" sx={{ alignItems: "center", mt: 0.75 }} spacing={1}>
                      <IconButton size="small" onClick={() => alterarQuantidade(item.id, item.quantidade - 1)} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 0, width: 22, height: 22 }}>
                        <Typography variant="caption">−</Typography>
                      </IconButton>
                      <Typography variant="caption">{item.quantidade}</Typography>
                      <IconButton size="small" onClick={() => alterarQuantidade(item.id, item.quantidade + 1)} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 0, width: 22, height: 22 }}>
                        <Typography variant="caption">+</Typography>
                      </IconButton>
                      <Typography
                        component="button"
                        variant="caption"
                        onClick={() => remover(item.id)}
                        sx={{ ml: 1, border: 0, bgcolor: "transparent", cursor: "pointer", color: "text.secondary", textDecoration: "underline" }}
                      >
                        remover
                      </Typography>
                    </Stack>
                  </Box>

                  <Money value={item.precoUnitario * item.quantidade} variant="body2" sx={{ fontWeight: 700, whiteSpace: "nowrap" }} />
                </Stack>
              ))}
            </Stack>
          )}
        </Box>

        {itens.length > 0 && (
          <Box sx={{ p: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
            <Stack spacing={0.75} sx={{ mb: 2 }}>
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
                    − <Money value={descontoCupom} component="span" />
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Money value={total} variant="subtitle1" sx={{ fontWeight: 700 }} />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Frete calculado no checkout
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Button variant="contained" size="large" onClick={irParaCheckout}>
                Finalizar compra
              </Button>
              <Button component={Link} to="/carrinho" variant="outlined" onClick={fechar}>
                Ver carrinho completo
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Drawer>
  );
}
