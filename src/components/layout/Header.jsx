import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  InputBase,
  Button,
  Badge,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";
import { Heart, LogIn, ShoppingBag, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { CATEGORIAS } from "../../data/categories.js";
import { SUBCATEGORIAS } from "../../data/subcategories.js";
import { useAuthStore, useUsuarioAtual } from "../../store/useAuthStore.js";
import { useCartStore } from "../../store/useCartStore.js";
import { useCartDrawerStore } from "../../store/useCartDrawerStore.js";
import { useSettingsStore } from "../../store/useSettingsStore.js";
import { linkWhatsapp } from "../../utils/whatsapp.js";

const navLinkSx = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 0.3,
  color: "text.primary",
  py: 0.5,
  borderBottom: "1px solid transparent",
  transition: "color 0.15s ease, border-color 0.15s ease",
  "&:hover": { color: "primary.main", borderColor: "primary.main" },
  "&.active": { color: "primary.main", borderColor: "primary.main" },
};

export default function Header() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [menuEl, setMenuEl] = useState(null);
  const [hovered, setHovered] = useState(null);
  const closeTimer = useRef(null);

  const userId = useAuthStore((s) => s.userId);
  const logout = useAuthStore((s) => s.logout);
  const usuario = useUsuarioAtual();
  const totalItensCarrinho = useCartStore((s) => s.totalItens());
  const abrirCarrinho = useCartDrawerStore((s) => s.abrir);
  const whatsapp = useSettingsStore((s) => s.loja.whatsapp);

  function submeterBusca(e) {
    e.preventDefault();
    navigate(busca.trim() ? `/produtos?q=${encodeURIComponent(busca.trim())}` : "/produtos");
  }

  function sair() {
    setMenuEl(null);
    logout();
    navigate("/");
  }

  function abrirMenu(slug) {
    clearTimeout(closeTimer.current);
    setHovered(slug);
  }
  function agendarFechar() {
    closeTimer.current = setTimeout(() => setHovered(null), 160);
  }
  function fecharImediato() {
    clearTimeout(closeTimer.current);
    setHovered(null);
  }

  const categoriaAberta = CATEGORIAS.find((c) => c.slug === hovered);

  return (
    <Box component="header" sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", py: 0.75, fontSize: 12, color: "text.secondary" }}>
            <span>Santa Maria · RS — enviamos para todo o Brasil</span>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <span>Cupom CHIMA10 · 10% na primeira compra</span>
              <Box
                component="a"
                href={linkWhatsapp(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar no WhatsApp"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                  lineHeight: 0,
                  "&:hover": { color: "#25D366" },
                }}
              >
                <FaWhatsapp size={15} />
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Stack direction="row" spacing={4} sx={{ alignItems: "center", py: 2 }}>
          <Box component={Link} to="/" sx={{ display: "block", whiteSpace: "nowrap", lineHeight: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
              Artes e Sabores
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Petit Formal Script", "Fraunces", cursive',
                fontSize: 22,
                lineHeight: 1,
                color: "#B5677A",
                textAlign: "right",
                mt: "-2px",
              }}
            >
              das Gurias
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={submeterBusca}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              px: 1.5,
              py: 0.5,
              minWidth: 160,
            }}
          >
            <InputBase
              placeholder="Buscar cuias, bombas, térmicas…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              sx={{ flex: 1, fontSize: 14 }}
            />
            <Button type="submit" size="small" sx={{ minWidth: "auto", px: 1.5 }}>
              Buscar
            </Button>
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", whiteSpace: "nowrap" }}>
            <IconButton
              component={Link}
              to="/favoritos"
              aria-label="Favoritos"
              size="small"
              sx={{ color: "text.primary" }}
            >
              <Heart size={20} strokeWidth={1.75} />
            </IconButton>

            {userId ? (
              <>
                <Stack
                  direction="row"
                  spacing={0.75}
                  component="button"
                  onClick={(e) => setMenuEl(e.currentTarget)}
                  sx={{
                    alignItems: "center",
                    border: 0,
                    bgcolor: "transparent",
                    cursor: "pointer",
                    color: "text.primary",
                    px: 1,
                    py: 0.75,
                  }}
                >
                  <User size={20} strokeWidth={1.75} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {usuario?.nome?.split(" ")[0] || "Conta"}
                  </Typography>
                </Stack>
                <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={() => setMenuEl(null)}>
                  {usuario?.role === "admin" && (
                    <MenuItem component={Link} to="/admin" onClick={() => setMenuEl(null)}>
                      Painel admin
                    </MenuItem>
                  )}
                  <MenuItem component={Link} to="/conta" onClick={() => setMenuEl(null)}>
                    Meus dados
                  </MenuItem>
                  <MenuItem component={Link} to="/pedidos" onClick={() => setMenuEl(null)}>
                    Meus pedidos
                  </MenuItem>
                  <MenuItem component={Link} to="/favoritos" onClick={() => setMenuEl(null)}>
                    Favoritos
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={sair}>Sair</MenuItem>
                </Menu>
              </>
            ) : (
              <Stack
                direction="row"
                spacing={0.75}
                component={Link}
                to="/entrar"
                sx={{ alignItems: "center", color: "text.primary", px: 1, py: 0.75 }}
              >
                <LogIn size={20} strokeWidth={1.75} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Entrar
                </Typography>
              </Stack>
            )}

            <Stack
              direction="row"
              spacing={0.75}
              component="button"
              onClick={abrirCarrinho}
              sx={{ alignItems: "center", border: 0, bgcolor: "transparent", cursor: "pointer", color: "text.primary", px: 1, py: 0.75 }}
            >
              <Badge badgeContent={totalItensCarrinho} color="primary">
                <ShoppingBag size={20} strokeWidth={1.75} />
              </Badge>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Carrinho
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Box sx={{ position: "relative" }} onMouseLeave={agendarFechar}>
          <Stack direction="row" spacing={3} sx={{ pb: 1.5, overflowX: "auto" }}>
            <Typography component={NavLink} to="/produtos" end sx={navLinkSx} onMouseEnter={fecharImediato}>
              Todos
            </Typography>
            {CATEGORIAS.map((c) => (
              <Typography
                key={c.slug}
                component={NavLink}
                to={`/categoria/${c.slug}`}
                sx={[
                  navLinkSx,
                  hovered === c.slug && { color: "primary.main", borderColor: "primary.main" },
                ]}
                onMouseEnter={() => abrirMenu(c.slug)}
              >
                {c.nome}
              </Typography>
            ))}
            <Typography component={NavLink} to="/produtos?personalizavel=1" sx={navLinkSx} onMouseEnter={fecharImediato}>
              Personalizados
            </Typography>
          </Stack>

          {categoriaAberta && (
            <Box
              onMouseEnter={() => abrirMenu(categoriaAberta.slug)}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderTop: "2px solid",
                borderTopColor: "primary.main",
                boxShadow: "0 12px 24px rgba(34, 26, 20, 0.08)",
                px: 4,
                py: 3,
                zIndex: 20,
              }}
            >
              <Stack direction="row" spacing={6}>
                <Stack spacing={1.25}>
                  <Typography variant="overline" color="text.secondary">
                    {categoriaAberta.nome}
                  </Typography>
                  {(SUBCATEGORIAS[categoriaAberta.slug] || []).map((nome) => (
                    <Typography
                      key={nome}
                      component={Link}
                      to={`/categoria/${categoriaAberta.slug}?sub=${encodeURIComponent(nome)}`}
                      variant="body2"
                      onClick={() => setHovered(null)}
                      sx={{ color: "text.primary", "&:hover": { color: "primary.main" } }}
                    >
                      {nome}
                    </Typography>
                  ))}
                </Stack>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Typography
                    component={Link}
                    to={`/categoria/${categoriaAberta.slug}`}
                    variant="body2"
                    onClick={() => setHovered(null)}
                    sx={{ fontWeight: 600, color: "primary.main" }}
                  >
                    Ver tudo em {categoriaAberta.nome} →
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
