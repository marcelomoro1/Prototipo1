import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Divider,
  Paper,
} from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import Money from "../../components/common/Money.jsx";
import { useAuthStore, useUsuarioAtual } from "../../store/useAuthStore.js";
import { useUsersStore } from "../../store/useUsersStore.js";
import { useCartStore } from "../../store/useCartStore.js";
import { useOrdersStore } from "../../store/useOrdersStore.js";
import { useProductsStore } from "../../store/useProductsStore.js";
import { useToastStore } from "../../store/useToastStore.js";
import { calcularOpcoesFrete, formatarCep, cepValido } from "../../utils/shipping.js";

const ETAPAS = ["Endereço", "Envio", "Pagamento", "Revisão"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.userId);
  const usuario = useUsuarioAtual();
  const enderecos = useUsersStore(useShallow((s) => s.enderecosDoUsuario(userId)));
  const salvarEndereco = useUsersStore((s) => s.salvarEndereco);

  const itens = useCartStore((s) => s.itens);
  const cupom = useCartStore((s) => s.cupom);
  const subtotal = useCartStore((s) => s.subtotal());
  const descontoCupom = useCartStore((s) => s.descontoCupom());
  const limparCarrinho = useCartStore((s) => s.limpar);
  const criarPedido = useOrdersStore((s) => s.criar);
  const ajustarEstoque = useProductsStore((s) => s.ajustarEstoque);
  const mostrarToast = useToastStore((s) => s.mostrar);

  const [etapa, setEtapa] = useState(0);
  const [enderecoId, setEnderecoId] = useState(enderecos.find((e) => e.principal)?.id || enderecos[0]?.id || "");
  const [novoEndereco, setNovoEndereco] = useState(false);
  const [form, setForm] = useState({
    apelido: "",
    destinatario: usuario?.nome || "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  const [metodoEnvioId, setMetodoEnvioId] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [cartao, setCartao] = useState({ numero: "", nome: "", validade: "", cvv: "" });
  const [finalizando, setFinalizando] = useState(false);

  const enderecoSelecionado = novoEndereco ? form : enderecos.find((e) => e.id === enderecoId);
  const opcoesFrete = useMemo(
    () => calcularOpcoesFrete(enderecoSelecionado?.cep),
    [enderecoSelecionado?.cep]
  );
  const frete = opcoesFrete.find((o) => o.id === metodoEnvioId) || opcoesFrete[0];
  const freteGratis = cupom?.tipo === "frete";
  const totalFrete = freteGratis ? 0 : frete?.custo || 0;
  const total = subtotal - descontoCupom + totalFrete;

  function proximo() {
    setEtapa((e) => Math.min(e + 1, ETAPAS.length - 1));
  }
  function voltar() {
    setEtapa((e) => Math.max(e - 1, 0));
  }

  function confirmarEndereco() {
    if (novoEndereco) {
      salvarEndereco({ ...form, userId, principal: enderecos.length === 0 });
    }
    proximo();
  }

  function finalizarPedido() {
    setFinalizando(true);
    setTimeout(() => {
      const pedido = criarPedido({
        userId,
        itens: itens.map((i) => ({
          produtoId: i.produtoId,
          nome: i.nome,
          variantesLabel: i.variantesLabel,
          personalizacaoTexto: i.personalizacaoTexto,
          precoUnitario: i.precoUnitario,
          quantidade: i.quantidade,
        })),
        enderecoEntrega: enderecoSelecionado,
        metodoEnvio: frete,
        metodoPagamento,
        pagamentoStatus: metodoPagamento === "cartao" ? "aprovado" : "aguardando",
        cupom,
        subtotal,
        desconto: descontoCupom,
        frete: totalFrete,
        total,
      });
      itens.forEach((i) => ajustarEstoque(i.produtoId, i.quantidade));
      limparCarrinho();
      mostrarToast("Pedido realizado com sucesso!");
      navigate(`/pedido-confirmado/${pedido.id}`);
    }, 900);
  }

  if (itens.length === 0) {
    navigate("/carrinho");
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={etapa} sx={{ mb: 5 }}>
        {ETAPAS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 8 }}>
          {etapa === 0 && (
            <Stack spacing={3}>
              <Typography variant="h6">Endereço de entrega</Typography>
              {enderecos.length > 0 && !novoEndereco && (
                <RadioGroup value={enderecoId} onChange={(e) => setEnderecoId(e.target.value)}>
                  {enderecos.map((e) => (
                    <Paper key={e.id} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                      <FormControlLabel
                        value={e.id}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {e.apelido} — {e.destinatario}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {e.logradouro}, {e.numero} {e.complemento} — {e.bairro}, {e.cidade}/{e.uf} · CEP{" "}
                              {formatarCep(e.cep)}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              )}

              {!novoEndereco ? (
                <Button variant="text" sx={{ alignSelf: "flex-start", px: 0 }} onClick={() => setNovoEndereco(true)}>
                  + Usar um novo endereço
                </Button>
              ) : (
                <Stack spacing={2}>
                  {enderecos.length > 0 && (
                    <Button
                      variant="text"
                      sx={{ alignSelf: "flex-start", px: 0 }}
                      onClick={() => setNovoEndereco(false)}
                    >
                      ← Usar endereço salvo
                    </Button>
                  )}
                  <TextField
                    label="Apelido (ex: Casa, Trabalho)"
                    value={form.apelido}
                    onChange={(e) => setForm((f) => ({ ...f, apelido: e.target.value }))}
                  />
                  <TextField
                    label="Destinatário"
                    value={form.destinatario}
                    onChange={(e) => setForm((f) => ({ ...f, destinatario: e.target.value }))}
                  />
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="CEP"
                      value={form.cep}
                      onChange={(e) => setForm((f) => ({ ...f, cep: formatarCep(e.target.value) }))}
                      sx={{ width: 160 }}
                    />
                    <TextField
                      label="Cidade"
                      value={form.cidade}
                      onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label="UF"
                      value={form.uf}
                      onChange={(e) => setForm((f) => ({ ...f, uf: e.target.value.slice(0, 2).toUpperCase() }))}
                      sx={{ width: 90 }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Logradouro"
                      value={form.logradouro}
                      onChange={(e) => setForm((f) => ({ ...f, logradouro: e.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label="Número"
                      value={form.numero}
                      onChange={(e) => setForm((f) => ({ ...f, numero: e.target.value }))}
                      sx={{ width: 120 }}
                    />
                  </Stack>
                  <TextField
                    label="Bairro / Complemento"
                    value={form.bairro}
                    onChange={(e) => setForm((f) => ({ ...f, bairro: e.target.value }))}
                  />
                </Stack>
              )}

              <Button
                variant="contained"
                size="large"
                disabled={!novoEndereco && !enderecoId}
                onClick={confirmarEndereco}
                sx={{ alignSelf: "flex-start" }}
              >
                Continuar para o envio
              </Button>
            </Stack>
          )}

          {etapa === 1 && (
            <Stack spacing={3}>
              <Typography variant="h6">Forma de envio</Typography>
              {!cepValido(enderecoSelecionado?.cep) ? (
                <Typography variant="body2" color="text.secondary">
                  Informe um CEP válido no endereço para calcular o frete.
                </Typography>
              ) : (
                <RadioGroup value={metodoEnvioId || opcoesFrete[0]?.id} onChange={(e) => setMetodoEnvioId(e.target.value)}>
                  {opcoesFrete.map((o) => (
                    <Paper key={o.id} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                      <FormControlLabel
                        value={o.id}
                        control={<Radio />}
                        label={
                          <Stack direction="row" sx={{ justifyContent: "space-between", width: 480, maxWidth: "70vw" }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {o.nome}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {o.descricao} · {o.prazoDias} dia(s) útil(is)
                              </Typography>
                            </Box>
                            <Money value={o.custo} variant="body2" sx={{ fontWeight: 600 }} />
                          </Stack>
                        }
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              )}
              <Stack direction="row" spacing={2}>
                <Button onClick={voltar}>Voltar</Button>
                <Button variant="contained" size="large" disabled={!opcoesFrete.length} onClick={proximo}>
                  Continuar para o pagamento
                </Button>
              </Stack>
            </Stack>
          )}

          {etapa === 2 && (
            <Stack spacing={3}>
              <Typography variant="h6">Forma de pagamento</Typography>
              <RadioGroup value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)}>
                <FormControlLabel value="pix" control={<Radio />} label="PIX" />
                <FormControlLabel value="cartao" control={<Radio />} label="Cartão de crédito" />
                <FormControlLabel value="boleto" control={<Radio />} label="Boleto bancário" />
              </RadioGroup>

              {metodoPagamento === "pix" && (
                <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 160,
                      height: 160,
                      mx: "auto",
                      mb: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      QR Code PIX (mock)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", wordBreak: "break-all" }}>
                    00020126360014BR.GOV.BCB.PIX...MOCK...ARTESESABORES
                  </Typography>
                </Paper>
              )}

              {metodoPagamento === "cartao" && (
                <Stack spacing={2} sx={{ maxWidth: 420 }}>
                  <TextField
                    label="Número do cartão"
                    value={cartao.numero}
                    onChange={(e) => setCartao((c) => ({ ...c, numero: e.target.value }))}
                  />
                  <TextField
                    label="Nome impresso no cartão"
                    value={cartao.nome}
                    onChange={(e) => setCartao((c) => ({ ...c, nome: e.target.value }))}
                  />
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Validade (MM/AA)"
                      value={cartao.validade}
                      onChange={(e) => setCartao((c) => ({ ...c, validade: e.target.value }))}
                    />
                    <TextField label="CVV" value={cartao.cvv} onChange={(e) => setCartao((c) => ({ ...c, cvv: e.target.value }))} />
                  </Stack>
                </Stack>
              )}

              {metodoPagamento === "boleto" && (
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    O boleto será gerado após a confirmação do pedido, com vencimento em 3 dias úteis.
                  </Typography>
                </Paper>
              )}

              <Stack direction="row" spacing={2}>
                <Button onClick={voltar}>Voltar</Button>
                <Button variant="contained" size="large" onClick={proximo}>
                  Revisar pedido
                </Button>
              </Stack>
            </Stack>
          )}

          {etapa === 3 && (
            <Stack spacing={3}>
              <Typography variant="h6">Revise antes de finalizar</Typography>

              <Box>
                <Typography variant="subtitle2">Itens</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {itens.map((i) => (
                    <Stack key={i.id} direction="row" sx={{ justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">
                        {i.quantidade}× {i.nome} {i.variantesLabel && `(${i.variantesLabel})`}
                      </Typography>
                      <Money value={i.precoUnitario * i.quantidade} variant="body2" />
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2">Entrega</Typography>
                <Typography variant="body2" color="text.secondary">
                  {enderecoSelecionado?.logradouro}, {enderecoSelecionado?.numero} — {enderecoSelecionado?.cidade}/
                  {enderecoSelecionado?.uf} · {frete?.nome} ({frete?.prazoDias} dia(s))
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Pagamento</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                  {metodoPagamento}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button onClick={voltar}>Voltar</Button>
                <Button variant="contained" size="large" disabled={finalizando} onClick={finalizarPedido}>
                  {finalizando ? "Processando..." : "Finalizar pedido"}
                </Button>
              </Stack>
            </Stack>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Resumo
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Money value={subtotal} variant="body2" />
              </Stack>
              {descontoCupom > 0 && (
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Desconto
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    − <Money value={descontoCupom} component="span" />
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Frete
                </Typography>
                <Typography variant="body2">{freteGratis ? "Grátis" : frete ? <Money value={totalFrete} /> : "—"}</Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Total
              </Typography>
              <Money value={Math.max(0, total)} variant="subtitle1" sx={{ fontWeight: 700 }} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
