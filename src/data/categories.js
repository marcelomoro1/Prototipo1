export const CATEGORIAS = [
  { slug: "cuias", nome: "Cuias" },
  { slug: "bombas", nome: "Bombas" },
  { slug: "termicas", nome: "Térmicas" },
  { slug: "kits", nome: "Kits" },
  { slug: "enfeites", nome: "Enfeites & Decoração" },
  { slug: "acessorios", nome: "Acessórios" },
];

export function nomeCategoria(slug) {
  return CATEGORIAS.find((c) => c.slug === slug)?.nome ?? slug;
}
