import { Outlet, Link } from "react-router-dom";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import AdminSidebar from "./AdminSidebar.jsx";
import ToastHost from "../common/ToastHost.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", py: 2 }}>
            <Typography component={Link} to="/admin" variant="subtitle1" sx={{ fontWeight: 600 }}>
              Artes e Sabores — Painel
            </Typography>
            <Button size="small" onClick={logout}>
              Sair
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ flex: 1, display: "flex" }}>
        <AdminSidebar />
        <Box sx={{ flex: 1, py: 4, pl: 4, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Container>

      <ToastHost />
    </Box>
  );
}
