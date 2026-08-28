import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/common/ScrollToTop.jsx";
import ClientLayout from "./components/layout/ClientLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import RequireAuth from "./components/routing/RequireAuth.jsx";
import RequireAdmin from "./components/routing/RequireAdmin.jsx";

import HomePage from "./pages/client/HomePage.jsx";
import LoginPage from "./pages/client/LoginPage.jsx";
import RegisterPage from "./pages/client/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/client/ForgotPasswordPage.jsx";
import ProductListingPage from "./pages/client/ProductListingPage.jsx";
import ProductDetailPage from "./pages/client/ProductDetailPage.jsx";
import FavoritesPage from "./pages/client/FavoritesPage.jsx";
import CartPage from "./pages/client/CartPage.jsx";
import CheckoutPage from "./pages/client/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/client/OrderSuccessPage.jsx";
import AccountPage from "./pages/client/AccountPage.jsx";
import OrdersPage from "./pages/client/OrdersPage.jsx";
import OrderDetailPage from "./pages/client/OrderDetailPage.jsx";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage.jsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage.jsx";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage.jsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
          <Route path="/produtos" element={<ProductListingPage />} />
          <Route path="/categoria/:slug" element={<ProductListingPage />} />
          <Route path="/produto/:id" element={<ProductDetailPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/pedido-confirmado/:id" element={<OrderSuccessPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/conta" element={<AccountPage />} />
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/pedidos/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/produtos" element={<AdminProductsPage />} />
            <Route path="/admin/produtos/novo" element={<AdminProductFormPage />} />
            <Route path="/admin/produtos/:id/editar" element={<AdminProductFormPage />} />
            <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
            <Route path="/admin/pedidos/:id" element={<AdminOrderDetailPage />} />
            <Route path="/admin/avaliacoes" element={<AdminReviewsPage />} />
            <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
