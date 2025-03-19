import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./Pages/HomePage";
import ComprarPage from "./Pages/ComprarPage";
import VenderPage from "./Pages/VenderPage";
import OrcamentoPage from "./Pages/OrcamentoPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comprar" element={<ComprarPage />} />
          <Route path="/vender" element={<VenderPage />} />
          <Route path="/orcamento" element={<OrcamentoPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
