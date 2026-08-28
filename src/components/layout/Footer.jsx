import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import { FaWhatsapp } from "react-icons/fa6";
import { CATEGORIAS } from "../../data/categories.js";
import { useSettingsStore } from "../../store/useSettingsStore.js";
import { linkWhatsapp } from "../../utils/whatsapp.js";

export default function Footer() {
  const loja = useSettingsStore((s) => s.loja);

  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: 10, bgcolor: "background.paper" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              {loja.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
              A {loja.nome} nasceu em {loja.cidade} do amor pela tradição do chimarrão. Cada peça é
              escolhida ou produzida artesanalmente para carregar identidade e afeto.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Enviamos para todo o Brasil.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 2.5 }}>
            <Typography variant="overline" color="text.secondary">
              Categorias
            </Typography>
            <Stack sx={{ mt: 1.5 }} spacing={1}>
              {CATEGORIAS.map((c) => (
                <Typography key={c.slug} component={Link} to={`/categoria/${c.slug}`} variant="body2">
                  {c.nome}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 2.5 }}>
            <Typography variant="overline" color="text.secondary">
              Institucional
            </Typography>
            <Stack sx={{ mt: 1.5 }} spacing={1}>
              <Typography component={Link} to="/pedidos" variant="body2">
                Meus pedidos
              </Typography>
              <Typography component={Link} to="/conta" variant="body2">
                Minha conta
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trocas e devoluções
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Atendimento
            </Typography>
            <Stack sx={{ mt: 1.5 }} spacing={1}>
              <Stack
                direction="row"
                spacing={0.75}
                component="a"
                href={linkWhatsapp(loja.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ alignItems: "center", color: "text.secondary", "&:hover": { color: "#25D366" } }}
              >
                <FaWhatsapp size={16} />
                <Typography variant="body2" color="inherit">
                  {loja.whatsapp}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {loja.instagram}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {loja.cidade}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 6 }}>
          © 2026 {loja.nome} — projeto de demonstração (frontend mockado, sem processamento real de pagamentos).
        </Typography>
      </Container>
    </Box>
  );
}
