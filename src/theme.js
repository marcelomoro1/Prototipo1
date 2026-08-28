import { createTheme } from "@mui/material/styles";

// Paleta minimalista inspirada na identidade da marca (couro, erva-mate, papel),
// tratada de forma neutra e contemporânea — sem gradientes, sem sombras pesadas.
const palette = {
  mode: "light",
  primary: {
    main: "#5B3A29",
    dark: "#3E2718",
    light: "#8A6A55",
    contrastText: "#FBF8F4",
  },
  secondary: {
    main: "#5C6B4F",
    contrastText: "#FBF8F4",
  },
  background: {
    default: "#FAF7F2",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#221A14",
    secondary: "#786A5C",
  },
  divider: "#E6DFD3",
  success: { main: "#4F7A4A" },
  warning: { main: "#B4802E" },
  error: { main: "#A33B2B" },
};

const theme = createTheme({
  palette,
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0.2 },
    overline: { letterSpacing: 1.4, fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 2, paddingInline: 20 },
        sizeLarge: { paddingBlock: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
      defaultProps: { elevation: 0 },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: "1px solid #E6DFD3" },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 2 } },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderColor: "#E6DFD3" } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#E6DFD3" } },
    },
  },
});

export default theme;
