import { NavLink } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/produtos", label: "Produtos" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/avaliacoes", label: "Avaliações" },
  { to: "/admin/configuracoes", label: "Configurações" },
];

export default function AdminSidebar() {
  return (
    <Box
      component="nav"
      sx={{
        width: 220,
        flexShrink: 0,
        borderRight: "1px solid",
        borderColor: "divider",
        py: 4,
        pr: 3,
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 2 }}>
        Administração
      </Typography>
      <Stack spacing={0.5}>
        {links.map((l) => (
          <Typography
            key={l.to}
            component={NavLink}
            to={l.to}
            end={l.end}
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "text.secondary",
              py: 1,
              px: 1.5,
              borderLeft: "2px solid transparent",
              "&.active": {
                color: "primary.main",
                borderColor: "primary.main",
                bgcolor: "background.default",
              },
            }}
          >
            {l.label}
          </Typography>
        ))}
      </Stack>

      <Typography
        component={NavLink}
        to="/"
        sx={{ fontSize: 13, color: "text.secondary", display: "block", mt: 4, px: 1.5 }}
      >
        Voltar à loja
      </Typography>
    </Box>
  );
}
