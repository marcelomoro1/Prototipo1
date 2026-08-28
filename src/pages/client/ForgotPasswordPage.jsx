import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, TextField, Button, Stack, Alert } from "@mui/material";
import { useUsersStore } from "../../store/useUsersStore.js";

export default function ForgotPasswordPage() {
  const redefinirSenha = useUsersStore((s) => s.redefinirSenha);

  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const r = redefinirSenha(email, novaSenha);
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <Container maxWidth="xs" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Senha redefinida
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Sua nova senha já está ativa. Você já pode entrar com ela.
        </Typography>
        <Button component={Link} to="/entrar" variant="contained">
          Ir para o login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Recuperar senha
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Informe seu e-mail cadastrado e defina uma nova senha (fluxo simulado, sem envio real de e-mail).
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {erro && <Alert severity="error" icon={false}>{erro}</Alert>}
          <TextField label="E-mail" type="email" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField
            label="Nova senha"
            type="password"
            required
            fullWidth
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <Button type="submit" variant="contained" size="large">
            Redefinir senha
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        <Typography component={Link} to="/entrar" variant="body2" sx={{ fontWeight: 600 }}>
          Voltar ao login
        </Typography>
      </Typography>
    </Container>
  );
}
