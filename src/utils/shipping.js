// Cálculo de frete mockado — determinístico a partir do CEP, sem chamada de API real.

const LOJA_CEP_PREFIXO = "97"; // Santa Maria - RS

export function limparCep(cep) {
  return String(cep || "").replace(/\D/g, "");
}

export function cepValido(cep) {
  return limparCep(cep).length === 8;
}

export function formatarCep(cep) {
  const digitos = limparCep(cep).slice(0, 8);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export function calcularOpcoesFrete(cep) {
  const digitos = limparCep(cep);
  if (digitos.length !== 8) return [];

  const local = digitos.startsWith(LOJA_CEP_PREFIXO);
  const semente = digitos.split("").reduce((soma, d) => soma + Number(d), 0);
  const distanciaFator = local ? 1 : 1 + (semente % 9) / 4;

  const pac = {
    id: "pac",
    nome: "PAC",
    descricao: "Envio econômico dos Correios",
    prazoDias: local ? 2 : Math.round(5 + distanciaFator * 2),
    custo: Number((local ? 12.9 : 18.9 + distanciaFator * 6).toFixed(2)),
  };
  const sedex = {
    id: "sedex",
    nome: "SEDEX",
    descricao: "Envio expresso dos Correios",
    prazoDias: local ? 1 : Math.round(2 + distanciaFator),
    custo: Number((local ? 22.9 : 34.9 + distanciaFator * 8).toFixed(2)),
  };
  const opcoes = [pac, sedex];

  if (local) {
    opcoes.unshift({
      id: "motoboy",
      nome: "Entrega local (motoboy)",
      descricao: "Somente para Santa Maria - RS",
      prazoDias: 1,
      custo: 9.9,
    });
  }

  return opcoes;
}
