import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Slider,
  Stack,
  Button,
} from "@mui/material";
import ProductCard from "../../components/common/ProductCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useCategoriesStore } from "../../store/useCategoriesStore.js";
import { precoMinimo } from "../../data/products.js";

const PRECO_MAX = 400;

export default function ProductListingPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const produtos = useProductsStore((s) => s.produtos);
  const categorias = useCategoriesStore((s) => s.categorias);

  const q = params.get("q") || "";
  const sub = params.get("sub") || "";
  const personalizavelSomente = params.get("personalizavel") === "1";
  const somenteEstoque = params.get("estoque") === "1";
  const ordenar = params.get("ordenar") || "relevancia";
  const faixa = [Number(params.get("min") || 0), Number(params.get("max") || PRECO_MAX)];

  function atualizar(chave, valor) {
    const novo = new URLSearchParams(params);
    if (valor === "" || valor === null || valor === undefined) novo.delete(chave);
    else novo.set(chave, valor);
    setParams(novo, { replace: true });
  }

  const listaBase = useMemo(() => {
    let lista = produtos.filter((p) => p.ativo);
    if (slug) lista = lista.filter((p) => p.categoria === slug);
    if (sub) lista = lista.filter((p) => p.subcategoria === sub);
    if (q) {
      const alvo = q.toLowerCase();
      lista = lista.filter((p) =>
        `${p.nome} ${p.subcategoria} ${p.material} ${p.tags.join(" ")}`.toLowerCase().includes(alvo)
      );
    }
    if (personalizavelSomente) lista = lista.filter((p) => p.personalizacao);
    if (somenteEstoque) lista = lista.filter((p) => p.estoque > 0);
    lista = lista.filter((p) => {
      const preco = precoMinimo(p);
      return preco >= faixa[0] && preco <= faixa[1];
    });

    switch (ordenar) {
      case "menor-preco":
        return [...lista].sort((a, b) => precoMinimo(a) - precoMinimo(b));
      case "maior-preco":
        return [...lista].sort((a, b) => precoMinimo(b) - precoMinimo(a));
      case "mais-vendidos":
        return [...lista].sort((a, b) => Number(b.maisVendido) - Number(a.maisVendido));
      default:
        return [...lista].sort((a, b) => b.avaliacaoMedia - a.avaliacaoMedia);
    }
  }, [produtos, slug, sub, q, personalizavelSomente, somenteEstoque, faixa[0], faixa[1], ordenar]);

  const nomeCategoriaAtual = slug ? categorias.find((c) => c.slug === slug)?.nome : null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {sub || nomeCategoriaAtual || (q ? `Resultados para “${q}”` : "Catálogo completo")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {listaBase.length} produto(s) encontrado(s)
        {sub && (
          <Typography
            component="button"
            onClick={() => atualizar("sub", "")}
            variant="body2"
            color="primary.main"
            sx={{ ml: 1.5, border: 0, bgcolor: "transparent", cursor: "pointer", p: 0, textDecoration: "underline" }}
          >
            limpar subcategoria
          </Typography>
        )}
      </Typography>

      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Ordenar por
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={ordenar}
                onChange={(e) => atualizar("ordenar", e.target.value)}
                sx={{ mt: 1 }}
              >
                <MenuItem value="relevancia">Relevância</MenuItem>
                <MenuItem value="menor-preco">Menor preço</MenuItem>
                <MenuItem value="maior-preco">Maior preço</MenuItem>
                <MenuItem value="mais-vendidos">Mais vendidos</MenuItem>
              </TextField>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Faixa de preço
              </Typography>
              <Box sx={{ px: 1, mt: 2 }}>
                <Slider
                  value={faixa}
                  min={0}
                  max={PRECO_MAX}
                  step={10}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `R$ ${v}`}
                  onChange={(_, v) => {
                    atualizar("min", v[0]);
                    atualizar("max", v[1]);
                  }}
                />
              </Box>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">
                  R$ {faixa[0]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  R$ {faixa[1]}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Disponibilidade
              </Typography>
              <FormControlLabel
                sx={{ display: "block", mt: 1 }}
                control={
                  <Checkbox
                    size="small"
                    checked={somenteEstoque}
                    onChange={(e) => atualizar("estoque", e.target.checked ? "1" : "")}
                  />
                }
                label={<Typography variant="body2">Somente em estoque</Typography>}
              />
              <FormControlLabel
                sx={{ display: "block" }}
                control={
                  <Checkbox
                    size="small"
                    checked={personalizavelSomente}
                    onChange={(e) => atualizar("personalizavel", e.target.checked ? "1" : "")}
                  />
                }
                label={<Typography variant="body2">Personalizáveis</Typography>}
              />
            </Box>

            <Button
              variant="text"
              size="small"
              sx={{ alignSelf: "flex-start", px: 0 }}
              onClick={() => setParams({}, { replace: true })}
            >
              Limpar filtros
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {listaBase.length ? (
            <Grid container spacing={2.5}>
              {listaBase.map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <ProductCard produto={p} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Tente ajustar os filtros ou buscar por outro termo."
              actionLabel="Limpar filtros"
              actionTo="/produtos"
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
