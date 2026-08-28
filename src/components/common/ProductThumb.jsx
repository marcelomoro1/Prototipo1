import { Box, Typography } from "@mui/material";

// Miniatura de produto: usa a foto real quando existe, cai para o placeholder tipográfico caso contrário.
// O elemento pai deve definir aspectRatio/tamanho — este componente só preenche 100% de largura/altura.
export default function ProductThumb({ imagem, subcategoria, alt }) {
  if (imagem) {
    return (
      <Box sx={{ width: "100%", height: "100%", bgcolor: "#F1EAE0", display: "flex" }}>
        <Box
          component="img"
          src={imagem}
          alt={alt || subcategoria || "Produto"}
          sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#F1EAE0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ textAlign: "center", px: 1 }}>
        {subcategoria}
      </Typography>
    </Box>
  );
}
