import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Garante que toda navegação (clique em produto, categoria, etc.) comece no topo da página.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
