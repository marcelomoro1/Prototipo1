import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useCategoriesStore } from "../../store/useCategoriesStore.js";
import { useToastStore } from "../../store/useToastStore.js";

const PRODUTO_VAZIO = {
  id: "",
  nome: "",
  categoria: "",
  subcategoria: "",
  precoBase: "",
  precoPromocional: "",
  descricaoCurta: "",
  descricaoCompleta: "",
  material: "",
  estoque: 0,
  variantes: [],
  personalizacao: null,
  tags: [],
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const produtoExistente = useProductsStore((s) => (editando ? s.buscarPorId(id) : null));
  const criar = useProductsStore((s) => s.criar);
  const atualizar = useProductsStore((s) => s.atualizar);
  const categorias = useCategoriesStore((s) => s.categorias);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [form, setForm] = useState(() =>
    editando && produtoExistente
      ? {
          ...produtoExistente,
          precoBase: String(produtoExistente.precoBase),
          precoPromocional: produtoExistente.precoPromocional ? String(produtoExistente.precoPromocional) : "",
        }
      : PRODUTO_VAZIO
  );
  const [personalizavel, setPersonalizavel] = useState(Boolean(produtoExistente?.personalizacao));

  function campo(chave) {
    return { value: form[chave], onChange: (e) => setForm((f) => ({ ...f, [chave]: e.target.value })) };
  }

  function adicionarGrupoVariante() {
    setForm((f) => ({
      ...f,
      variantes: [...f.variantes, { chave: `var${f.variantes.length}`, label: "", opcoes: [{ valor: "", precoAdicional: 0 }] }],
    }));
  }
  function atualizarGrupo(idx, dados) {
    setForm((f) => ({ ...f, variantes: f.variantes.map((g, i) => (i === idx ? { ...g, ...dados } : g)) }));
  }
  function removerGrupo(idx) {
    setForm((f) => ({ ...f, variantes: f.variantes.filter((_, i) => i !== idx) }));
  }
  function adicionarOpcao(idx) {
    atualizarGrupo(idx, { opcoes: [...form.variantes[idx].opcoes, { valor: "", precoAdicional: 0 }] });
  }
  function atualizarOpcao(idxGrupo, idxOpcao, dados) {
    const opcoes = form.variantes[idxGrupo].opcoes.map((o, i) => (i === idxOpcao ? { ...o, ...dados } : o));
    atualizarGrupo(idxGrupo, { opcoes });
  }
  function removerOpcao(idxGrupo, idxOpcao) {
    atualizarGrupo(idxGrupo, { opcoes: form.variantes[idxGrupo].opcoes.filter((_, i) => i !== idxOpcao) });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dados = {
      ...form,
      precoBase: Number(form.precoBase),
      precoPromocional: form.precoPromocional ? Number(form.precoPromocional) : null,
      estoque: Number(form.estoque),
      personalizacao: personalizavel
        ? form.personalizacao || { label: "Personalização", maxCaracteres: 20, precoAdicional: 0, prazoExtraDias: 5 }
        : null,
    };

    if (editando) {
      atualizar(id, dados);
      mostrarToast("Produto atualizado.");
    } else {
      criar(dados);
      mostrarToast("Produto cadastrado.");
    }
    navigate("/admin/produtos");
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {editando ? "Editar produto" : "Novo produto"}
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            <TextField label="Nome" required {...campo("nome")} />
            <Stack direction="row" spacing={2}>
              <TextField label="Categoria" select required sx={{ flex: 1 }} {...campo("categoria")}>
                {categorias.map((c) => (
                  <MenuItem key={c.slug} value={c.slug}>
                    {c.nome}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Subcategoria" required sx={{ flex: 1 }} {...campo("subcategoria")} />
            </Stack>
            <TextField label="Material" required {...campo("material")} />
            <TextField label="Descrição curta" required {...campo("descricaoCurta")} />
            <TextField label="Descrição completa" required multiline minRows={3} {...campo("descricaoCompleta")} />

            <Stack direction="row" spacing={2}>
              <TextField label="Preço base (R$)" type="number" required sx={{ flex: 1 }} {...campo("precoBase")} />
              <TextField label="Preço promocional (R$)" type="number" sx={{ flex: 1 }} {...campo("precoPromocional")} />
              <TextField label="Estoque" type="number" required sx={{ flex: 1 }} {...campo("estoque")} />
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Variantes
              </Typography>
              <Button size="small" onClick={adicionarGrupoVariante}>
                + Grupo
              </Button>
            </Stack>

            <Stack spacing={2}>
              {form.variantes.map((grupo, idxGrupo) => (
                <Box key={idxGrupo} sx={{ border: "1px solid", borderColor: "divider", p: 1.5 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <TextField
                      size="small"
                      label="Nome do grupo (ex: Tamanho)"
                      fullWidth
                      value={grupo.label}
                      onChange={(e) => atualizarGrupo(idxGrupo, { label: e.target.value })}
                    />
                    <Button size="small" color="error" onClick={() => removerGrupo(idxGrupo)}>
                      Remover
                    </Button>
                  </Stack>
                  <Stack spacing={1}>
                    {grupo.opcoes.map((o, idxOpcao) => (
                      <Stack key={idxOpcao} direction="row" spacing={1}>
                        <TextField
                          size="small"
                          label="Opção"
                          value={o.valor}
                          onChange={(e) => atualizarOpcao(idxGrupo, idxOpcao, { valor: e.target.value })}
                        />
                        <TextField
                          size="small"
                          label="Adicional (R$)"
                          type="number"
                          sx={{ width: 130 }}
                          value={o.precoAdicional}
                          onChange={(e) => atualizarOpcao(idxGrupo, idxOpcao, { precoAdicional: Number(e.target.value) })}
                        />
                        <IconButton size="small" onClick={() => removerOpcao(idxGrupo, idxOpcao)}>
                          ×
                        </IconButton>
                      </Stack>
                    ))}
                    <Button size="small" sx={{ alignSelf: "flex-start" }} onClick={() => adicionarOpcao(idxGrupo)}>
                      + Opção
                    </Button>
                  </Stack>
                </Box>
              ))}
              {form.variantes.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  Nenhuma variante — o produto será vendido em uma única versão.
                </Typography>
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <FormControlLabel
              control={<Checkbox checked={personalizavel} onChange={(e) => setPersonalizavel(e.target.checked)} />}
              label="Produto aceita personalização"
            />
            {personalizavel && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  size="small"
                  label="Instrução ao cliente"
                  value={form.personalizacao?.label || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, personalizacao: { ...(f.personalizacao || {}), label: e.target.value } }))
                  }
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    type="number"
                    label="Máx. caracteres"
                    value={form.personalizacao?.maxCaracteres || 20}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        personalizacao: { ...(f.personalizacao || {}), maxCaracteres: Number(e.target.value) },
                      }))
                    }
                  />
                  <TextField
                    size="small"
                    type="number"
                    label="Dias extras de produção"
                    value={form.personalizacao?.prazoExtraDias || 5}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        personalizacao: { ...(f.personalizacao || {}), prazoExtraDias: Number(e.target.value) },
                      }))
                    }
                  />
                </Stack>
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" size="large">
          {editando ? "Salvar alterações" : "Cadastrar produto"}
        </Button>
        <Button size="large" onClick={() => navigate("/admin/produtos")}>
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
}
