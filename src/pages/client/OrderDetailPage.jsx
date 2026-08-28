import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Money from "../../components/common/Money.jsx";
import { useOrdersStore } from "../../store/useOrdersStore.js";
import { useUsuarioAtual } from "../../store/useAuthStore.js";
import { useCartStore } from "../../store/useCartStore.js";
import { useReviewsStore } from "../../store/useReviewsStore.js";
import { useToastStore } from "../../store/useToastStore.js";
import { formatarData } from "../../utils/format.js";

const STATUS_LABEL = { processando: "Processando", enviado: "Enviado", entregue: "Entregue", cancelado: "Cancelado" };
const LINHA_DO_TEMPO = ["processando", "enviado", "entregue"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pedido = useOrdersStore((s) => s.buscarPorId(id));
  const cancelar = useOrdersStore((s) => s.cancelar);
  const usuario = useUsuarioAtual();
  const adicionarAoCarrinho = useCartStore((s) => s.adicionar);
  const jaAvaliou = useReviewsStore((s) => s.jaAvaliou);
  const criarAvaliacao = useReviewsStore((s) => s.criar);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [trocaAberta, setTrocaAberta] = useState(false);
  const [motivoTroca, setMotivoTroca] = useState("");
  const [itemAvaliando, setItemAvaliando] = useState(null);

  if (!pedido) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Pedido não encontrado
        </Typography>
        <Button component={Link} to="/pedidos" variant="outlined">
          Voltar aos pedidos
        </Button>
      </Container>
    );
  }

  function repetirPedido() {
    pedido.itens.forEach((i) =>
      adicionarAoCarrinho({
        produtoId: i.produtoId,
        nome: i.nome,
        subcategoria: "",
        variantesEscolhidas: {},
        variantesLabel: i.variantesLabel,
        personalizacaoTexto: i.personalizacaoTexto,
        precoUnitario: i.precoUnitario,
        quantidade: i.quantidade,
      })
    );
    mostrarToast("Itens do pedido adicionados ao carrinho.");
    navigate("/carrinho");
  }

  function enviarSolicitacaoTroca() {
    setTrocaAberta(false);
    mostrarToast("Solicitação de troca/devolução enviada. Entraremos em contato em breve.");
    setMotivoTroca("");
  }

  const passoAtual = LINHA_DO_TEMPO.indexOf(pedido.status);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h4">Pedido #{pedido.id}</Typography>
          <Typography variant="body2" color="text.secondary">
            Realizado em {formatarData(pedido.criadoEm)}
          </Typography>
        </Box>
        <Chip label={STATUS_LABEL[pedido.status]} color={pedido.status === "cancelado" ? "error" : "secondary"} variant="outlined" />
      </Stack>

      {pedido.status !== "cancelado" && (
        <Stack direction="row" spacing={0} sx={{ mb: 5 }}>
          {LINHA_DO_TEMPO.map((s, i) => (
            <Box key={s} sx={{ flex: 1, textAlign: "center" }}>
              <Box
                sx={{
                  height: 2,
                  bgcolor: i <= passoAtual ? "primary.main" : "divider",
                  mb: 1,
                }}
              />
              <Typography variant="caption" color={i <= passoAtual ? "text.primary" : "text.secondary"}>
                {STATUS_LABEL[s]}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {pedido.codigoRastreio && (
        <Typography variant="body2" sx={{ mb: 3 }}>
          Código de rastreio: <strong>{pedido.codigoRastreio}</strong>
        </Typography>
      )}

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Itens
          </Typography>
          <Stack divider={<Divider />} spacing={2}>
            {pedido.itens.map((item, idx) => {
              const podeAvaliar =
                pedido.status === "entregue" && usuario && !jaAvaliou(usuario.id, item.produtoId, pedido.id);
              return (
                <Stack key={idx} spacing={0.5}>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography
                      component={Link}
                      to={`/produto/${item.produtoId}`}
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                    >
                      {item.quantidade}× {item.nome}
                    </Typography>
                    <Money value={item.precoUnitario * item.quantidade} variant="body2" />
                  </Stack>
                  {item.variantesLabel && (
                    <Typography variant="caption" color="text.secondary">
                      {item.variantesLabel}
                    </Typography>
                  )}
                  {podeAvaliar && (
                    <Button size="small" variant="text" sx={{ alignSelf: "flex-start", px: 0 }} onClick={() => setItemAvaliando(item)}>
                      Avaliar produto
                    </Button>
                  )}
                </Stack>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={repetirPedido}>
              Repetir pedido
            </Button>
            {pedido.status !== "cancelado" && (
              <Button variant="text" color="inherit" onClick={() => setTrocaAberta(true)}>
                Solicitar troca/devolução
              </Button>
            )}
            {pedido.status === "processando" && (
              <Button variant="text" color="error" onClick={() => cancelar(pedido.id)}>
                Cancelar pedido
              </Button>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Endereço de entrega
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pedido.enderecoEntrega?.logradouro}, {pedido.enderecoEntrega?.numero} {pedido.enderecoEntrega?.complemento}
              <br />
              {pedido.enderecoEntrega?.bairro} — {pedido.enderecoEntrega?.cidade}/{pedido.enderecoEntrega?.uf}
              <br />
              CEP {pedido.enderecoEntrega?.cep}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Pagamento e valores
            </Typography>
            <Stack spacing={0.75}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Forma de envio
                </Typography>
                <Typography variant="body2">{pedido.metodoEnvio?.nome}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Pagamento
                </Typography>
                <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                  {pedido.metodoPagamento} · {pedido.pagamentoStatus}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Money value={pedido.subtotal} variant="body2" />
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Frete
                </Typography>
                <Money value={pedido.frete} variant="body2" />
              </Stack>
              {pedido.desconto > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Desconto
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    − <Money value={pedido.desconto} component="span" />
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1 }}>
                <Typography variant="subtitle2">Total</Typography>
                <Money value={pedido.total} variant="subtitle2" sx={{ fontWeight: 700 }} />
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={trocaAberta} onClose={() => setTrocaAberta(false)} fullWidth maxWidth="xs">
        <DialogTitle>Solicitar troca ou devolução</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label="Descreva o motivo"
            value={motivoTroca}
            onChange={(e) => setMotivoTroca(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrocaAberta(false)}>Cancelar</Button>
          <Button variant="contained" disabled={!motivoTroca.trim()} onClick={enviarSolicitacaoTroca}>
            Enviar solicitação
          </Button>
        </DialogActions>
      </Dialog>

      <AvaliarDialog
        item={itemAvaliando}
        onClose={() => setItemAvaliando(null)}
        onEnviar={(nota, comentario) => {
          criarAvaliacao({
            produtoId: itemAvaliando.produtoId,
            userId: usuario.id,
            usuarioNome: usuario.nome,
            nota,
            comentario,
            pedidoId: pedido.id,
          });
          mostrarToast("Avaliação enviada. Obrigado pelo retorno!");
          setItemAvaliando(null);
        }}
      />
    </Container>
  );
}

function AvaliarDialog({ item, onClose, onEnviar }) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  return (
    <Dialog open={Boolean(item)} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Avaliar {item?.nome}</DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="text.secondary">
          Nota
        </Typography>
        <Box sx={{ mt: 0.5, mb: 2 }}>
          <ToggleButtonGroup exclusive size="small" value={nota} onChange={(_, v) => v && setNota(v)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <ToggleButton key={n} value={n} sx={{ width: 40 }}>
                {n}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Comentário"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!comentario.trim()} onClick={() => onEnviar(nota, comentario)}>
          Enviar avaliação
        </Button>
      </DialogActions>
    </Dialog>
  );
}
