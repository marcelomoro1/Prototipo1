import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Stack, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BANNERS } from "../../data/banners.js";

const HERO_HEIGHT = { xs: 520, sm: 480, md: 540 };

function FramedPhoto({ banner }) {
  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      {/* halo de cor suave atrás do quadro */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 300, sm: 380, md: 440 },
          height: { xs: 300, sm: 380, md: 440 },
          borderRadius: "50%",
          bgcolor: banner.cor,
          opacity: 0.3,
          filter: "blur(64px)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          transform: "rotate(-3deg)",
          transition: "transform 0.35s ease",
          "&:hover": { transform: "rotate(-1deg) scale(1.02)" },
        }}
      >
        <Box
          sx={{
            bgcolor: "#FBF8F4",
            p: "10px",
            pb: "26px",
            borderRadius: "10px",
            boxShadow: "0 32px 56px -16px rgba(0,0,0,0.55), 0 10px 22px -10px rgba(0,0,0,0.35)",
            width: { xs: 250, sm: 300, md: 340 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              aspectRatio: "4 / 5",
              overflow: "hidden",
              borderRadius: "4px",
            }}
          >
            <Box
              component="img"
              src={banner.imagem}
              alt={banner.titulo}
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: banner.cor,
                opacity: 0.16,
                mixBlendMode: "multiply",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function HeroCarousel() {
  const [indice, setIndice] = useState(0);
  const navigate = useNavigate();
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setIndice((i) => (i + 1) % BANNERS.length), 6000);
    return () => clearInterval(timer.current);
  }, []);

  function resetTimer() {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIndice((x) => (x + 1) % BANNERS.length), 6000);
  }

  function irPara(i) {
    setIndice(i);
    resetTimer();
  }
  function avancar() {
    setIndice((i) => (i + 1) % BANNERS.length);
    resetTimer();
  }
  function voltar() {
    setIndice((i) => (i - 1 + BANNERS.length) % BANNERS.length);
    resetTimer();
  }

  const banner = BANNERS[indice];

  const arrowSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: "primary.contrastText",
    border: "1px solid rgba(255,255,255,0.35)",
    bgcolor: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(2px)",
    width: 44,
    height: 44,
    zIndex: 3,
    "&:hover": { bgcolor: "rgba(255,255,255,0.16)", borderColor: "rgba(255,255,255,0.6)" },
  };

  return (
    <Box
      sx={{
        bgcolor: banner.fundo || "primary.dark",
        transition: "background-color 0.6s ease",
        color: "primary.contrastText",
        position: "relative",
        height: HERO_HEIGHT,
        overflow: "hidden",
      }}
    >
      <IconButton aria-label="Slide anterior" onClick={voltar} sx={{ ...arrowSx, left: { xs: 8, md: 24 } }}>
        <ChevronLeft size={22} strokeWidth={1.75} />
      </IconButton>
      <IconButton aria-label="Próximo slide" onClick={avancar} sx={{ ...arrowSx, right: { xs: 8, md: 24 } }}>
        <ChevronRight size={22} strokeWidth={1.75} />
      </IconButton>

      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Stack
          key={indice}
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            gap: 4,
            animation: "heroFadeIn 0.7s ease",
          }}
        >
          <Box sx={{ maxWidth: 480 }}>
            <Typography variant="overline" sx={{ opacity: 0.8, mb: 1, display: "block" }}>
              {banner.tag}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                mb: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {banner.titulo}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.85,
                mb: 3,
                maxWidth: 420,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {banner.subtitulo}
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              sx={{ color: "primary.dark", bgcolor: "background.paper", "&:hover": { bgcolor: "grey.100" } }}
              onClick={() => navigate(`/produto/${banner.produtoId}`)}
            >
              Ver produto
            </Button>
          </Box>

          <Box sx={{ display: { xs: "none", sm: "flex" }, flexShrink: 0, width: { sm: 380, md: 440 }, height: "100%" }}>
            <FramedPhoto banner={banner} />
          </Box>
        </Stack>
      </Container>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      >
        {BANNERS.map((b, i) => (
          <Box
            key={b.id}
            onClick={() => irPara(i)}
            sx={{
              cursor: "pointer",
              width: 32,
              height: 2,
              bgcolor: i === indice ? "background.paper" : "rgba(255,255,255,0.35)",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
