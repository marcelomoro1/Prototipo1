import { useState } from "react";
import { Typography, Stack, Box, TextField, MenuItem, Paper, Button, Chip } from "@mui/material";
import RatingText from "../../components/common/RatingText.jsx";
import { useReviewsStore } from "../../store/useReviewsStore.js";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useToastStore } from "../../store/useToastStore.js";
import { formatarData } from "../../utils/format.js";

export default function AdminReviewsPage() {
  const avaliacoes = useReviewsStore((s) => s.avaliacoes);
  const alternarOculto = useReviewsStore((s) => s.alternarOculto);
  const responder = useReviewsStore((s) => s.responder);
  const produtos = useProductsStore((s) => s.produtos);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [filtroNota, setFiltroNota] = useState("todas");
  const [respostas, setRespostas] = useState({});

  const lista = [...avaliacoes]
    .filter((a) => filtroNota === "todas" || a.nota === Number(filtroNota))
    .sort((a, b) => (a.data < b.data ? 1 : -1));

  function nomeProduto(id) {
    return produtos.find((p) => p.id === id)?.nome || id;
  }

  function enviarResposta(id) {
    const texto = respostas[id];
    if (!texto?.trim()) return;
    responder(id, texto.trim());
    mostrarToast("Resposta publicada.");
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Avaliações</Typography>
        <Typography variant="body2" color="text.secondary">
          {avaliacoes.length} avaliações recebidas
        </Typography>
      </Box>

      <TextField select size="small" label="Nota" value={filtroNota} onChange={(e) => setFiltroNota(e.target.value)} sx={{ maxWidth: 180 }}>
        <MenuItem value="todas">Todas</MenuItem>
        {[5, 4, 3, 2, 1].map((n) => (
          <MenuItem key={n} value={n}>
            {n} estrelas
          </MenuItem>
        ))}
      </TextField>

      <Stack spacing={2}>
        {lista.map((a) => (
          <Paper key={a.id} variant="outlined" sx={{ p: 2.5, opacity: a.oculto ? 0.55 : 1 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="subtitle2">
                  {a.usuarioNome} · {nomeProduto(a.produtoId)}
                </Typography>
                <RatingText media={a.nota} total={0} />
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {a.comentario}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatarData(a.data)}
                </Typography>
              </Box>
              <Stack spacing={1} sx={{ alignItems: "flex-end" }}>
                {a.oculto && <Chip size="small" label="Oculta" />}
                <Button size="small" onClick={() => alternarOculto(a.id)}>
                  {a.oculto ? "Reexibir" : "Ocultar"}
                </Button>
              </Stack>
            </Stack>

            {a.respostaAdmin ? (
              <Box sx={{ mt: 1.5, pl: 2, borderLeft: "2px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary">
                  Sua resposta: {a.respostaAdmin}
                </Typography>
              </Box>
            ) : (
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <TextField
                  size="small"
                  placeholder="Responder avaliação"
                  fullWidth
                  value={respostas[a.id] || ""}
                  onChange={(e) => setRespostas((r) => ({ ...r, [a.id]: e.target.value }))}
                />
                <Button size="small" variant="outlined" onClick={() => enviarResposta(a.id)}>
                  Responder
                </Button>
              </Stack>
            )}
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
