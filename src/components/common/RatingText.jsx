import { Box, Typography } from "@mui/material";

// Representação minimalista de avaliação — sem ícones de estrela, apenas uma
// barra de preenchimento proporcional à nota e o texto numérico.
export default function RatingText({ media = 0, total = 0, size = "small" }) {
  const percentual = Math.max(0, Math.min(100, (media / 5) * 100));
  const altura = size === "small" ? 3 : 4;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 56, height: altura, bgcolor: "divider", borderRadius: 4, overflow: "hidden" }}>
        <Box sx={{ width: `${percentual}%`, height: "100%", bgcolor: "primary.main" }} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {media > 0 ? media.toFixed(1) : "—"}
        {total > 0 ? ` · ${total} avaliações` : " · sem avaliações"}
      </Typography>
    </Box>
  );
}
