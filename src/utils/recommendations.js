// Estrutura de recomendação mockada.
// Anônimo: mostra produtos em tendência (mais vendidos / destaque).
// Logado: usa categorias dos favoritos e do histórico de pedidos para pontuar o catálogo.

export function produtosRelacionados(produto, produtos, limite = 4) {
  return produtos
    .filter((p) => p.id !== produto.id && p.categoria === produto.categoria && p.ativo !== false)
    .slice(0, limite);
}

export function produtosTendencia(produtos, limite = 8) {
  return [...produtos]
    .filter((p) => p.ativo !== false)
    .sort((a, b) => Number(b.maisVendido) - Number(a.maisVendido) || b.avaliacaoMedia - a.avaliacaoMedia)
    .slice(0, limite);
}

export function produtosRecomendados({ produtos, favoritoIds = [], pedidos = [], limite = 8 }) {
  const ativos = produtos.filter((p) => p.ativo !== false);

  const categoriasInteresse = new Map();
  const marcarInteresse = (categoria, peso) => {
    categoriasInteresse.set(categoria, (categoriasInteresse.get(categoria) || 0) + peso);
  };

  favoritoIds.forEach((id) => {
    const produto = ativos.find((p) => p.id === id);
    if (produto) marcarInteresse(produto.categoria, 3);
  });
  pedidos.forEach((pedido) => {
    pedido.itens?.forEach((item) => {
      const produto = ativos.find((p) => p.id === item.produtoId);
      if (produto) marcarInteresse(produto.categoria, 1.5);
    });
  });

  const idsExcluir = new Set(favoritoIds);

  if (categoriasInteresse.size === 0) {
    return produtosTendencia(ativos, limite).filter((p) => !idsExcluir.has(p.id));
  }

  return ativos
    .filter((p) => !idsExcluir.has(p.id))
    .map((p) => ({
      produto: p,
      score: (categoriasInteresse.get(p.categoria) || 0) + p.avaliacaoMedia / 10 + (p.maisVendido ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map((x) => x.produto);
}
