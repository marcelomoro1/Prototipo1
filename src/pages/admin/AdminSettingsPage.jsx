import { useState } from "react";
import { Typography, Stack, Box, Tabs, Tab, TextField, Button, Paper } from "@mui/material";
import { useCategoriesStore } from "../../store/useCategoriesStore.js";
import { useSettingsStore } from "../../store/useSettingsStore.js";
import { useToastStore } from "../../store/useToastStore.js";

export default function AdminSettingsPage() {
  const [aba, setAba] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Configurações da loja
      </Typography>

      <Tabs value={aba} onChange={(_, v) => setAba(v)} sx={{ mb: 4, borderBottom: "1px solid", borderColor: "divider" }}>
        <Tab label="Categorias" />
        <Tab label="Regras de frete" />
        <Tab label="Dados da loja" />
      </Tabs>

      {aba === 0 && <Categorias />}
      {aba === 1 && <RegrasFrete />}
      {aba === 2 && <DadosLoja />}
    </Box>
  );
}

function Categorias() {
  const categorias = useCategoriesStore((s) => s.categorias);
  const criar = useCategoriesStore((s) => s.criar);
  const renomear = useCategoriesStore((s) => s.renomear);
  const remover = useCategoriesStore((s) => s.remover);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [novoNome, setNovoNome] = useState("");
  const [editandoSlug, setEditandoSlug] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState("");

  function adicionar(e) {
    e.preventDefault();
    if (!novoNome.trim()) return;
    criar(novoNome.trim());
    setNovoNome("");
    mostrarToast("Categoria criada.");
  }

  function salvarEdicao(slug) {
    renomear(slug, nomeEdicao);
    setEditandoSlug(null);
    mostrarToast("Categoria renomeada.");
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 480 }}>
      {categorias.map((c) => (
        <Paper key={c.slug} variant="outlined" sx={{ p: 2 }}>
          {editandoSlug === c.slug ? (
            <Stack direction="row" spacing={1}>
              <TextField size="small" fullWidth value={nomeEdicao} onChange={(e) => setNomeEdicao(e.target.value)} />
              <Button size="small" variant="contained" onClick={() => salvarEdicao(c.slug)}>
                Salvar
              </Button>
              <Button size="small" onClick={() => setEditandoSlug(null)}>
                Cancelar
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">{c.nome}</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={() => {
                    setEditandoSlug(c.slug);
                    setNomeEdicao(c.nome);
                  }}
                >
                  Renomear
                </Button>
                <Button size="small" color="error" onClick={() => remover(c.slug)}>
                  Remover
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>
      ))}

      <Box component="form" onSubmit={adicionar} sx={{ display: "flex", gap: 1 }}>
        <TextField size="small" fullWidth label="Nova categoria" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        <Button type="submit" variant="outlined">
          Adicionar
        </Button>
      </Box>
    </Stack>
  );
}

function RegrasFrete() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 560 }}>
      <Typography variant="body2" color="text.secondary">
        As opções de frete são calculadas automaticamente a partir do CEP informado pelo cliente. Regras atuais:
      </Typography>
      {[
        { nome: "Entrega local (motoboy)", regra: "Somente CEPs de Santa Maria - RS · 1 dia útil · a partir de R$ 9,90" },
        { nome: "PAC", regra: "Nacional · 2 a 9 dias úteis · a partir de R$ 12,90" },
        { nome: "SEDEX", regra: "Nacional · 1 a 5 dias úteis · a partir de R$ 22,90" },
      ].map((r) => (
        <Paper key={r.nome} variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2">{r.nome}</Typography>
          <Typography variant="caption" color="text.secondary">
            {r.regra}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
}

function DadosLoja() {
  const loja = useSettingsStore((s) => s.loja);
  const atualizarLoja = useSettingsStore((s) => s.atualizarLoja);
  const mostrarToast = useToastStore((s) => s.mostrar);
  const [form, setForm] = useState(loja);

  function salvar(e) {
    e.preventDefault();
    atualizarLoja(form);
    mostrarToast("Dados da loja atualizados.");
  }

  return (
    <Box component="form" onSubmit={salvar} sx={{ maxWidth: 480 }}>
      <Stack spacing={2}>
        <TextField label="Nome da loja" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
        <TextField label="Slogan" value={form.slogan} onChange={(e) => setForm((f) => ({ ...f, slogan: e.target.value }))} />
        <TextField label="Cidade" value={form.cidade} onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))} />
        <TextField label="WhatsApp" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />
        <TextField label="Instagram" value={form.instagram} onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))} />
        <TextField label="E-mail" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <TextField
          label="Política de trocas"
          multiline
          minRows={2}
          value={form.politicaTrocas}
          onChange={(e) => setForm((f) => ({ ...f, politicaTrocas: e.target.value }))}
        />
        <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Salvar
        </Button>
      </Stack>
    </Box>
  );
}
