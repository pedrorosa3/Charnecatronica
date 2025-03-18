import React, { useState, useEffect } from "react"; // Certifique-se de importar useState e useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./Pages/HomePage";
import ComprarPage from "./Pages/ComprarPage";
import VenderPage from "./Pages/VenderPage";
import ProjetosPage from "./Pages/ProjetosPage";

function App() {
  // Definindo o estado para a mensagem
  const [message, setMessage] = useState('');

  // Usando o hook useEffect para fazer a requisição à API
  useEffect(() => {
    fetch('http://localhost:8000/api/')
      .then(response => response.json())
      .then(data => setMessage(data.message))  // Atualiza o estado com a resposta da API
      .catch(error => console.log(error));
  }, []); // O array vazio [] garante que a requisição só aconteça uma vez, na montagem do componente

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comprar" element={<ComprarPage />} />
          <Route path="/vender" element={<VenderPage />} />
          <Route path="/projetos-beneficiencia" element={<ProjetosPage />} />
        </Routes>
      </Router>

      {/* Exibe a mensagem recebida da API */}
      <div>
        <h1>{message}</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
