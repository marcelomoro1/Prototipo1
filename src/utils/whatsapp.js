// Monta o link wa.me a partir de um telefone com DDD, ex: "(55) 99999-0000".
// Prefixa o código do país (55) — coincide com o DDD de Santa Maria, mas são dígitos distintos.
export function linkWhatsapp(numeroComDdd) {
  const digitos = String(numeroComDdd || "").replace(/\D/g, "");
  return `https://wa.me/55${digitos}`;
}
