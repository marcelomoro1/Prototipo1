import Typography from "@mui/material/Typography";
import { formatarPreco } from "../../utils/format.js";

export default function Money({ value, component = "span", ...rest }) {
  return (
    <Typography component={component} {...rest}>
      {formatarPreco(value)}
    </Typography>
  );
}
