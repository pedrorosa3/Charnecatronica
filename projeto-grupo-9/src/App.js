import React, { useState, useEffect } from "react"; // Certifique-se de importar useState e useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./Pages/HomePage";
import ComprarPage from "./Pages/ComprarPage";
import VenderPage from "./Pages/VenderPage";
import OrcamentoPage from "./Pages/OrcamentoPage";
import ProjetosPage from "./Pages/ProjetosPage";
import VendasPage from "./Pages/VendasPage";
import LoginPage from "./Pages/LoginPage";
import Carrinho from "./Pages/Carrinho";
import ProjetosPageFuncionario from "./Pages/ProjetosPageFuncionário";
import AddProjetoPage from "./Pages/AddProjetoPage";
import DetalhesProduto from "./Pages/DetalhesProduto";
import DetalhesCompra from "./Pages/DetalhesCompra";
import Perfil from "./Pages/Perfil";

function App() {
  // Estado para armazenar a resposta da API
  const [apiResponse, setApiResponse] = useState("");

  // Função para chamar a API
  const callAPI = () => {
    fetch("http://localhost:9000/testAPI")
      .then((res) => res.text())
      .then((res) => setApiResponse(res))
      .catch((err) => console.error("Erro ao chamar API:", err));
  };

  // useEffect para chamar a API ao montar o componente
  useEffect(() => {
    callAPI();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comprar" element={<ComprarPage />} />
          <Route path="/comprarAoCliente" element={<VenderPage />} />
          <Route path="/orcamento" element={<OrcamentoPage />} />
          <Route path="/doar" element={<ProjetosPage />} />
          <Route path="/equipamentosComprados" element={<VendasPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route
            path="/doarFuncionario"
            element={<ProjetosPageFuncionario />}
          />
          <Route path="/adicionar-projeto" element={<AddProjetoPage />} />
          <Route path="/produto/:id" element={<DetalhesProduto />} />
          <Route
            path="/equipamentosComprados/:id"
            element={<DetalhesCompra />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
