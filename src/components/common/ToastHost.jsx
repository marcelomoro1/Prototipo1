import { Snackbar, Alert } from "@mui/material";
import { useToastStore } from "../../store/useToastStore.js";

export default function ToastHost() {
  const { mensagem, severidade, aberto, fechar } = useToastStore();

  return (
    <Snackbar
      open={aberto}
      autoHideDuration={3000}
      onClose={fechar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={fechar} severity={severidade} variant="filled" icon={false} sx={{ borderRadius: 0 }}>
        {mensagem}
      </Alert>
    </Snackbar>
  );
}
