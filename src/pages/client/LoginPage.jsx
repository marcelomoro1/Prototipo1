import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Stack, Alert, Divider } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const loginSocial = useAuthStore((s) => s.loginSocial);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const destino = location.state?.from?.pathname || "/";

  function handleSubmit(e) {
    e.preventDefault();
    const r = login(email, senha);
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    navigate(r.usuario.role === "admin" ? "/admin" : destino, { replace: true });
  }

  function entrarComGoogle() {
    loginSocial("Usuário Google", "convidado.google@artesesabores.com.br");
    navigate(destino, { replace: true });
  }

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Entrar
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Acesse sua conta para acompanhar pedidos e favoritos.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {erro && <Alert severity="error" icon={false}>{erro}</Alert>}
          <TextField
            label="E-mail"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            required
            fullWidth
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Typography component={Link} to="/recuperar-senha" variant="caption" sx={{ alignSelf: "flex-end" }}>
            Esqueci minha senha
          </Typography>
          <Button type="submit" variant="contained" size="large">
            Entrar
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }}>ou</Divider>

      <Button variant="outlined" size="large" fullWidth onClick={entrarComGoogle}>
        Continuar com Google
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        Ainda não tem conta?{" "}
        <Typography component={Link} to="/cadastro" variant="body2" sx={{ fontWeight: 600 }}>
          Cadastre-se
        </Typography>
      </Typography>

      <Box sx={{ mt: 5, p: 2, border: "1px dashed", borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary" component="div">
          Demonstração — contas de teste:
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          Cliente: joao.ritter@ufn.edu.br / 123456
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          Admin: admin@artesesabores.com.br / admin123
        </Typography>
      </Box>
    </Container>
  );
}
