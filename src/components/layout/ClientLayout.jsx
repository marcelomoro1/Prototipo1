import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ToastHost from "../common/ToastHost.jsx";
import CartDrawer from "../common/CartDrawer.jsx";

export default function ClientLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <ToastHost />
      <CartDrawer />
    </Box>
  );
}
