import { Container, Grid, Box, Typography, Button, Stack } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { Link } from "react-router-dom";
import HeroCarousel from "../../components/common/HeroCarousel.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useFavoritesStore } from "../../store/useFavoritesStore.js";
import { useOrdersStore } from "../../store/useOrdersStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { produtosRecomendados } from "../../utils/recommendations.js";

export default function HomePage() {
  const produtos = useProductsStore((s) => s.produtos);
  const userId = useAuthStore((s) => s.userId);
  const favoritos = useFavoritesStore(useShallow((s) => (userId ? s.listar(userId) : [])));
  const pedidos = useOrdersStore(useShallow((s) => (userId ? s.listarPorUsuario(userId) : [])));

  const recomendados = produtosRecomendados({ produtos, favoritoIds: favoritos, pedidos, limite: 8 });

  // Produtos com foto real aparecem sempre em primeiro lugar nos mais vendidos;
  // o restante das vagas é preenchido pelos demais best-sellers mockados.
  const produtosComFoto = produtos.filter((p) => p.ativo && p.imagem);
  const maisVendidosSemFoto = produtos.filter((p) => p.ativo && p.maisVendido && !p.imagem);
  const maisVendidos = [...produtosComFoto, ...maisVendidosSemFoto].slice(0, 8);

  return (
    <Box>
      <HeroCarousel />

      <Box sx={{ bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider", borderBottom: "1px solid" }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <SectionHeading
            title="Mais vendidos"
            subtitle="Os favoritos de quem já é da família do mate"
            action={
              <Button component={Link} to="/produtos" size="small">
                Ver catálogo completo
              </Button>
            }
          />
          <Grid container spacing={2.5}>
            {maisVendidos.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard produto={p} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionHeading
          title={userId ? "Recomendados para você" : "Em alta agora"}
          subtitle={
            userId
              ? "Selecionados a partir dos seus favoritos e pedidos"
              : "Entre na sua conta para ver recomendações personalizadas"
          }
        />
        <Grid container spacing={2.5}>
          {recomendados.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard produto={p} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
        <Container maxWidth="lg" sx={{ py: 7, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Personalize sua peça
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mb: 3, maxWidth: 480, mx: "auto" }}>
            Gravação de nome, iniciais ou frase em cuias e bombas selecionadas — feito sob encomenda.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
            <Button
              component={Link}
              to="/produtos?personalizavel=1"
              variant="contained"
              color="inherit"
              sx={{ color: "primary.main", bgcolor: "background.paper" }}
            >
              Ver personalizados
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
