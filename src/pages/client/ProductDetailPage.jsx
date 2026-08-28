import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import RatingText from "../../components/common/RatingText.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";
import ProductThumb from "../../components/common/ProductThumb.jsx";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useCartStore } from "../../store/useCartStore.js";
import { useFavoritesStore } from "../../store/useFavoritesStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useReviewsStore } from "../../store/useReviewsStore.js";
import { useToastStore } from "../../store/useToastStore.js";
import { precoBaseAtual } from "../../data/products.js";
import { formatarData } from "../../utils/format.js";
import { produtosRelacionados } from "../../utils/recommendations.js";
import { nomeCategoria } from "../../data/categories.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const produtos = useProductsStore((s) => s.produtos);
  const produto = produtos.find((p) => p.id === id);

  const adicionarAoCarrinho = useCartStore((s) => s.adicionar);
  const userId = useAuthStore((s) => s.userId);
  const favoritos = useFavoritesStore(useShallow((s) => (userId ? s.listar(userId) : [])));
  const alternarFavorito = useFavoritesStore((s) => s.alternar);
  const avaliacoes = useReviewsStore(useShallow((s) => (produto ? s.doProduto(produto.id) : [])));
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [selecao, setSelecao] = useState(() =>
    Object.fromEntries((produto?.variantes || []).map((g) => [g.chave, g.opcoes[0].valor]))
  );
  const [personalizacaoTexto, setPersonalizacaoTexto] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const relacionados = useMemo(
    () => (produto ? produtosRelacionados(produto, produtos) : []),
    [produto, produtos]
  );

  if (!produto) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Produto não encontrado
        </Typography>
        <Button component={Link} to="/produtos" variant="outlined">
          Voltar ao catálogo
        </Button>
      </Container>
    );
  }

  const adicionalVariantes = (produto.variantes || []).reduce((soma, grupo) => {
    const opcao = grupo.opcoes.find((o) => o.valor === selecao[grupo.chave]);
    return soma + (opcao?.precoAdicional || 0);
  }, 0);
  const precoUnitario = precoBaseAtual(produto) + adicionalVariantes;
  const emFalta = produto.estoque <= 0;
  const eFavorito = userId && favoritos.includes(produto.id);
  const precisaTexto = produto.personalizacao && !personalizacaoTexto.trim();

  function alterarSelecao(chave, valor) {
    if (valor === null) return;
    setSelecao((s) => ({ ...s, [chave]: valor }));
  }

  function favoritar() {
    if (!userId) {
      navigate("/entrar", { state: { from: { pathname: `/produto/${produto.id}` } } });
      return;
    }
    alternarFavorito(userId, produto.id);
  }

  function handleAdicionar() {
    if (produto.personalizacao && !personalizacaoTexto.trim()) return;
    const variantesLabel = (produto.variantes || [])
      .map((g) => `${g.label}: ${selecao[g.chave]}`)
      .join(" · ");
    adicionarAoCarrinho({
      produtoId: produto.id,
      nome: produto.nome,
      subcategoria: produto.subcategoria,
      variantesEscolhidas: selecao,
      variantesLabel,
      personalizacaoTexto: personalizacaoTexto.trim() || null,
      precoUnitario,
      quantidade,
      prazoProducaoDias: produto.prazoProducaoDias + (produto.personalizacao?.prazoExtraDias || 0),
    });
    mostrarToast(`"${produto.nome}" adicionado ao carrinho.`);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        <Typography component={Link} to="/produtos" variant="body2" color="text.secondary">
          Catálogo
        </Typography>
        {"  ›  "}
        <Typography component={Link} to={`/categoria/${produto.categoria}`} variant="body2" color="text.secondary">
          {nomeCategoria(produto.categoria)}
        </Typography>
        {"  ›  "}
        {produto.nome}
      </Typography>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ aspectRatio: "4 / 3", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
            <ProductThumb imagem={produto.imagem} subcategoria={produto.subcategoria} alt={produto.nome} />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={0.75} direction="row" sx={{ mb: 1 }}>
            {produto.maisVendido && <Chip size="small" label="Mais vendido" variant="outlined" />}
            {produto.precoPromocional && <Chip size="small" label="Oferta" color="secondary" variant="outlined" />}
          </Stack>

          <Typography variant="h4" sx={{ mb: 1 }}>
            {produto.nome}
          </Typography>
          <RatingText media={produto.avaliacaoMedia} total={produto.numeroAvaliacoes} size="large" />

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2.5, mb: 1 }}>
            {produto.descricaoCompleta}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Material: {produto.material}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "baseline", mb: 3 }}>
            {produto.precoPromocional && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                {produto.precoBase.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </Typography>
            )}
            <Typography variant="h4" sx={{ fontFamily: "inherit", fontWeight: 700 }}>
              {precoUnitario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </Typography>
          </Stack>

          {(produto.variantes || []).map((grupo) => (
            <Box key={grupo.chave} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {grupo.label}
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={selecao[grupo.chave]}
                onChange={(_, v) => alterarSelecao(grupo.chave, v)}
                size="small"
              >
                {grupo.opcoes.map((o) => (
                  <ToggleButton key={o.valor} value={o.valor} sx={{ textTransform: "none", px: 2 }}>
                    {o.valor}
                    {o.precoAdicional > 0 && ` (+R$ ${o.precoAdicional.toFixed(2)})`}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          ))}

          {produto.personalizacao && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {produto.personalizacao.label}
              </Typography>
              <TextField
                fullWidth
                placeholder={`Até ${produto.personalizacao.maxCaracteres} caracteres`}
                value={personalizacaoTexto}
                onChange={(e) => setPersonalizacaoTexto(e.target.value.slice(0, produto.personalizacao.maxCaracteres))}
                helperText={`${personalizacaoTexto.length}/${produto.personalizacao.maxCaracteres} · prazo de produção +${produto.personalizacao.prazoExtraDias} dias`}
              />
            </Box>
          )}

          <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
            <TextField
              type="number"
              label="Qtd."
              size="small"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
              sx={{ width: 90 }}
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <Typography variant="caption" color="text.secondary">
              {emFalta ? "Fora de estoque" : `${produto.estoque} em estoque · produção em ${produto.prazoProducaoDias} dia(s) útil(is)`}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              disabled={emFalta || precisaTexto}
              onClick={handleAdicionar}
              sx={{ flex: 1 }}
            >
              {emFalta ? "Indisponível" : "Adicionar ao carrinho"}
            </Button>
            <Button variant="outlined" size="large" onClick={favoritar}>
              {eFavorito ? "Remover dos favoritos" : "Favoritar"}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 8 }} />

      <Box sx={{ maxWidth: 720 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Avaliações de clientes
        </Typography>
        {avaliacoes.length ? (
          <Stack spacing={3}>
            {avaliacoes.map((r) => (
              <Box key={r.id}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography variant="subtitle2">{r.usuarioNome}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatarData(r.data)}
                  </Typography>
                </Stack>
                <RatingText media={r.nota} total={0} />
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {r.comentario}
                </Typography>
                {r.respostaAdmin && (
                  <Box sx={{ mt: 1, pl: 2, borderLeft: "2px solid", borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary">
                      Resposta da loja: {r.respostaAdmin}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Este produto ainda não tem avaliações. Avaliações ficam disponíveis para quem já comprou, em
            "Meus pedidos", após a entrega.
          </Typography>
        )}
      </Box>

      {relacionados.length > 0 && (
        <>
          <Divider sx={{ my: 8 }} />
          <Typography variant="h5" sx={{ mb: 3 }}>
            Você também pode gostar
          </Typography>
          <Grid container spacing={2.5}>
            {relacionados.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductCard produto={p} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
