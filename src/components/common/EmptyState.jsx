import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
        px: 2,
        border: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: "auto" }}>
          {description}
        </Typography>
      )}
      {actionLabel && actionTo && (
        <Button component={Link} to={actionTo} variant="outlined">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
