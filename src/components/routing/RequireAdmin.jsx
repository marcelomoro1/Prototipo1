import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function RequireAdmin() {
  const userId = useAuthStore((s) => s.userId);
  const role = useAuthStore((s) => s.role);

  if (!userId) return <Navigate to="/entrar" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
