import { Link } from "react-router-dom";
import { Box, Card, CardActionArea, Typography, Chip, Stack } from "@mui/material";
import RatingText from "./RatingText.jsx";
import Money from "./Money.jsx";
import ProductThumb from "./ProductThumb.jsx";
import { precoMinimo } from "../../data/products.js";

export default function ProductCard({ produto }) {
  const temPromo = produto.precoPromocional !== null && produto.precoPromocional !== undefined;
  const preco = precoMinimo(produto);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        component={Link}
        to={`/produto/${produto.id}`}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}
      >
        <Box sx={{ aspectRatio: "4 / 3", overflow: "hidden", borderBottom: "1px solid", borderColor: "divider" }}>
          <ProductThumb imagem={produto.imagem} subcategoria={produto.subcategoria} alt={produto.nome} />
        </Box>

        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.75, flex: 1 }}>
          <Stack direction="row" spacing={0.75} sx={{ minHeight: 24 }}>
            {produto.maisVendido && <Chip size="small" label="Mais vendido" variant="outlined" />}
            {temPromo && <Chip size="small" label="Oferta" color="secondary" variant="outlined" />}
          </Stack>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {produto.nome}
          </Typography>

          <RatingText media={produto.avaliacaoMedia} total={produto.numeroAvaliacoes} />

          <Box sx={{ mt: "auto", pt: 1 }}>
            {temPromo && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textDecoration: "line-through", display: "block" }}
              >
                {produto.precoBase.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </Typography>
            )}
            <Money value={preco} variant="h6" sx={{ fontFamily: "inherit", fontWeight: 700 }} />
            {produto.variantes?.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                a partir de
              </Typography>
            )}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
