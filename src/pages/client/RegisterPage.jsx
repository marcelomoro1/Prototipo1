import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Stack, Alert } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const registrar = useAuthStore((s) => s.registrar);

  const [dados, setDados] = useState({ nome: "", email: "", telefone: "", senha: "" });
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  function campo(chave) {
    return {
      value: dados[chave],
      onChange: (e) => setDados((d) => ({ ...d, [chave]: e.target.value })),
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (dados.senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    const r = registrar(dados);
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Criar conta
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Leva menos de um minuto.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {erro && <Alert severity="error" icon={false}>{erro}</Alert>}
          <TextField label="Nome completo" required fullWidth {...campo("nome")} />
          <TextField label="E-mail" type="email" required fullWidth {...campo("email")} />
          <TextField label="Telefone" required fullWidth {...campo("telefone")} />
          <TextField label="Senha" type="password" required fullWidth {...campo("senha")} />
          <TextField
            label="Confirmar senha"
            type="password"
            required
            fullWidth
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <Button type="submit" variant="contained" size="large">
            Criar conta
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        Já tem conta?{" "}
        <Typography component={Link} to="/entrar" variant="body2" sx={{ fontWeight: 600 }}>
          Entrar
        </Typography>
      </Typography>
    </Container>
  );
}
