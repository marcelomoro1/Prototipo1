export const CUPONS = [
  { codigo: "CHIMA10", tipo: "percentual", valor: 10, descricao: "10% de desconto no pedido" },
  { codigo: "FRETEGRATIS", tipo: "frete", valor: 100, descricao: "Frete grátis" },
  { codigo: "BEMVINDO15", tipo: "percentual", valor: 15, descricao: "15% de desconto na primeira compra" },
];

export function buscarCupom(codigo) {
  return CUPONS.find((c) => c.codigo.toLowerCase() === String(codigo || "").trim().toLowerCase()) ?? null;
}
