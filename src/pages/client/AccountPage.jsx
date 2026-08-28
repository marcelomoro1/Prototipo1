import { useState } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Stack,
  TextField,
  Button,
  Alert,
  Paper,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { useUsuarioAtual } from "../../store/useAuthStore.js";
import { useUsersStore } from "../../store/useUsersStore.js";
import { useToastStore } from "../../store/useToastStore.js";

export default function AccountPage() {
  const [aba, setAba] = useState(0);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Minha conta
      </Typography>

      <Tabs value={aba} onChange={(_, v) => setAba(v)} sx={{ mb: 4, borderBottom: "1px solid", borderColor: "divider" }}>
        <Tab label="Dados pessoais" />
        <Tab label="Senha" />
        <Tab label="Endereços" />
        <Tab label="Notificações" />
      </Tabs>

      {aba === 0 && <DadosPessoais />}
      {aba === 1 && <AlterarSenha />}
      {aba === 2 && <Enderecos />}
      {aba === 3 && <Notificacoes />}
    </Container>
  );
}

function DadosPessoais() {
  const usuario = useUsuarioAtual();
  const atualizarPerfil = useUsersStore((s) => s.atualizarPerfil);
  const mostrarToast = useToastStore((s) => s.mostrar);
  const [form, setForm] = useState({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone });

  function salvar(e) {
    e.preventDefault();
    atualizarPerfil(usuario.id, form);
    mostrarToast("Dados atualizados com sucesso.");
  }

  return (
    <Box component="form" onSubmit={salvar}>
      <Stack spacing={2} sx={{ maxWidth: 400 }}>
        <TextField label="Nome" fullWidth value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
        <TextField label="E-mail" fullWidth value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <TextField
          label="Telefone"
          fullWidth
          value={form.telefone}
          onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
        />
        <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Salvar alterações
        </Button>
      </Stack>
    </Box>
  );
}

function AlterarSenha() {
  const usuario = useUsuarioAtual();
  const alterarSenha = useUsersStore((s) => s.alterarSenha);
  const mostrarToast = useToastStore((s) => s.mostrar);
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [erro, setErro] = useState("");

  function salvar(e) {
    e.preventDefault();
    const r = alterarSenha(usuario.id, atual, nova);
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    setErro("");
    setAtual("");
    setNova("");
    mostrarToast("Senha alterada com sucesso.");
  }

  return (
    <Box component="form" onSubmit={salvar}>
      <Stack spacing={2} sx={{ maxWidth: 400 }}>
        {erro && <Alert severity="error" icon={false}>{erro}</Alert>}
        <TextField label="Senha atual" type="password" required fullWidth value={atual} onChange={(e) => setAtual(e.target.value)} />
        <TextField label="Nova senha" type="password" required fullWidth value={nova} onChange={(e) => setNova(e.target.value)} />
        <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Alterar senha
        </Button>
      </Stack>
    </Box>
  );
}

function Enderecos() {
  const usuario = useUsuarioAtual();
  const enderecos = useUsersStore(useShallow((s) => s.enderecosDoUsuario(usuario.id)));
  const salvarEndereco = useUsersStore((s) => s.salvarEndereco);
  const removerEndereco = useUsersStore((s) => s.removerEndereco);
  const definirPrincipal = useUsersStore((s) => s.definirEnderecoPrincipal);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const vazio = { apelido: "", destinatario: usuario.nome, cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "" };
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(vazio);

  function abrirNovo() {
    setForm(vazio);
    setEditando("novo");
  }
  function abrirEdicao(end) {
    setForm(end);
    setEditando(end.id);
  }
  function salvar(e) {
    e.preventDefault();
    salvarEndereco({ ...form, userId: usuario.id, id: editando === "novo" ? undefined : editando });
    mostrarToast("Endereço salvo.");
    setEditando(null);
  }

  return (
    <Stack spacing={2}>
      {enderecos.map((e) => (
        <Paper key={e.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {e.apelido} {e.principal && "· principal"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {e.logradouro}, {e.numero} — {e.bairro}, {e.cidade}/{e.uf} · CEP {e.cep}
              </Typography>
            </Box>
            <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
              <Button size="small" onClick={() => abrirEdicao(e)}>
                Editar
              </Button>
              {!e.principal && (
                <Button size="small" onClick={() => definirPrincipal(usuario.id, e.id)}>
                  Definir principal
                </Button>
              )}
              <Button size="small" color="error" onClick={() => removerEndereco(e.id)}>
                Remover
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}

      {editando ? (
        <Box component="form" onSubmit={salvar}>
          <Stack spacing={2}>
            <TextField label="Apelido" required value={form.apelido} onChange={(e) => setForm((f) => ({ ...f, apelido: e.target.value }))} />
            <TextField
              label="Destinatário"
              required
              value={form.destinatario}
              onChange={(e) => setForm((f) => ({ ...f, destinatario: e.target.value }))}
            />
            <Stack direction="row" spacing={2}>
              <TextField label="CEP" required value={form.cep} onChange={(e) => setForm((f) => ({ ...f, cep: e.target.value }))} sx={{ width: 160 }} />
              <TextField label="Cidade" required fullWidth value={form.cidade} onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))} />
              <TextField label="UF" required value={form.uf} onChange={(e) => setForm((f) => ({ ...f, uf: e.target.value }))} sx={{ width: 90 }} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Logradouro"
                required
                fullWidth
                value={form.logradouro}
                onChange={(e) => setForm((f) => ({ ...f, logradouro: e.target.value }))}
              />
              <TextField label="Número" required value={form.numero} onChange={(e) => setForm((f) => ({ ...f, numero: e.target.value }))} sx={{ width: 120 }} />
            </Stack>
            <TextField label="Bairro" required value={form.bairro} onChange={(e) => setForm((f) => ({ ...f, bairro: e.target.value }))} />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                Salvar endereço
              </Button>
              <Button onClick={() => setEditando(null)}>Cancelar</Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Button variant="outlined" sx={{ alignSelf: "flex-start" }} onClick={abrirNovo}>
          + Adicionar endereço
        </Button>
      )}
    </Stack>
  );
}

function Notificacoes() {
  const [prefs, setPrefs] = useState({ promocoes: true, statusPedido: true, novidades: false, canal: "email" });

  return (
    <Stack spacing={2}>
      <FormControlLabel
        control={<Checkbox checked={prefs.statusPedido} onChange={(e) => setPrefs((p) => ({ ...p, statusPedido: e.target.checked }))} />}
        label="Atualizações de status do pedido"
      />
      <FormControlLabel
        control={<Checkbox checked={prefs.promocoes} onChange={(e) => setPrefs((p) => ({ ...p, promocoes: e.target.checked }))} />}
        label="Promoções e cupons"
      />
      <FormControlLabel
        control={<Checkbox checked={prefs.novidades} onChange={(e) => setPrefs((p) => ({ ...p, novidades: e.target.checked }))} />}
        label="Lançamentos e novidades"
      />

      <Typography variant="overline" color="text.secondary" sx={{ mt: 2 }}>
        Canal preferido
      </Typography>
      <RadioGroup value={prefs.canal} onChange={(e) => setPrefs((p) => ({ ...p, canal: e.target.value }))}>
        <FormControlLabel value="email" control={<Radio />} label="E-mail" />
        <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
      </RadioGroup>

      <Button variant="contained" sx={{ alignSelf: "flex-start", mt: 1 }}>
        Salvar preferências
      </Button>
    </Stack>
  );
}
