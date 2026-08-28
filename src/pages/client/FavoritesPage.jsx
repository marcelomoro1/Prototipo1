import { Link } from "react-router-dom";
import { Container, Grid, Box, Typography, Card, CardActionArea, Button, Stack } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import EmptyState from "../../components/common/EmptyState.jsx";
import RatingText from "../../components/common/RatingText.jsx";
import Money from "../../components/common/Money.jsx";
import ProductThumb from "../../components/common/ProductThumb.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useFavoritesStore } from "../../store/useFavoritesStore.js";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useCartStore } from "../../store/useCartStore.js";
import { useToastStore } from "../../store/useToastStore.js";
import { precoBaseAtual } from "../../data/products.js";

export default function FavoritesPage() {
  const userId = useAuthStore((s) => s.userId);
  const favoritoIds = useFavoritesStore(useShallow((s) => s.listar(userId)));
  const remover = useFavoritesStore((s) => s.remover);
  const produtos = useProductsStore((s) => s.produtos);
  const adicionarAoCarrinho = useCartStore((s) => s.adicionar);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const favoritos = favoritoIds.map((id) => produtos.find((p) => p.id === id)).filter(Boolean);

  function irParaCarrinho(produto) {
    const selecao = Object.fromEntries((produto.variantes || []).map((g) => [g.chave, g.opcoes[0].valor]));
    const adicional = (produto.variantes || []).reduce(
      (soma, g) => soma + (g.opcoes[0]?.precoAdicional || 0),
      0
    );
    adicionarAoCarrinho({
      produtoId: produto.id,
      nome: produto.nome,
      subcategoria: produto.subcategoria,
      variantesEscolhidas: selecao,
      variantesLabel: (produto.variantes || []).map((g) => `${g.label}: ${selecao[g.chave]}`).join(" · "),
      personalizacaoTexto: null,
      precoUnitario: precoBaseAtual(produto) + adicional,
      quantidade: 1,
      prazoProducaoDias: produto.prazoProducaoDias,
    });
    mostrarToast(`"${produto.nome}" adicionado ao carrinho.`);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Favoritos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {favoritos.length} produto(s) salvos
      </Typography>

      {favoritos.length === 0 ? (
        <EmptyState
          title="Você ainda não tem favoritos"
          description="Toque em “Favoritar” na página de um produto para guardá-lo aqui."
          actionLabel="Ver catálogo"
          actionTo="/produtos"
        />
      ) : (
        <Grid container spacing={2.5}>
          {favoritos.map((produto) => (
            <Grid key={produto.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardActionArea component={Link} to={`/produto/${produto.id}`}>
                  <Box sx={{ aspectRatio: "4 / 3", overflow: "hidden", borderBottom: "1px solid", borderColor: "divider" }}>
                    <ProductThumb imagem={produto.imagem} subcategoria={produto.subcategoria} alt={produto.nome} />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {produto.nome}
                    </Typography>
                    <RatingText media={produto.avaliacaoMedia} total={produto.numeroAvaliacoes} />
                    <Money value={precoBaseAtual(produto)} variant="h6" sx={{ mt: 1, fontWeight: 700 }} />
                  </Box>
                </CardActionArea>
                <Stack direction="row" spacing={1} sx={{ p: 2, pt: 0 }}>
                  <Button size="small" variant="contained" fullWidth onClick={() => irParaCarrinho(produto)}>
                    Ir para o carrinho
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => remover(userId, produto.id)}>
                    Remover
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
