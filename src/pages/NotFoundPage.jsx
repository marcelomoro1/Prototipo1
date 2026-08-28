import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 14, textAlign: "center" }}>
      <Typography variant="overline" color="text.secondary">
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Página não encontrada
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Voltar à loja
      </Button>
    </Container>
  );
}
