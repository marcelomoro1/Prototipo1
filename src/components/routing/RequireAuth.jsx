import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function RequireAuth() {
  const userId = useAuthStore((s) => s.userId);
  const location = useLocation();

  if (!userId) {
    return <Navigate to="/entrar" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
