import React, { useState, useEffect } from "react"; // Certifique-se de importar useState e useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./Pages/HomePage";
import ComprarPage from "./Pages/ComprarPage";
import VenderPage from "./Pages/VenderPage";
import OrcamentoPage from "./Pages/OrcamentoPage";
import ProjetosPage from "./Pages/ProjetosPage";
import ProjetoDetalhesPage from "./Pages/ProjetosDetalhesPage"; // NOVO
import VendasPage from "./Pages/VendasPage";
import LoginPage from "./Pages/LoginPage";
import Carrinho from "./Pages/Carrinho";
import ProjetosPageFuncionario from "./Pages/ProjetosPageFuncionário";
import AddProjetoPage from "./Pages/AddProjetoPage";
import DetalhesProduto from "./Pages/DetalhesProduto";
import DetalhesCompra from "./Pages/DetalhesCompra";
import Perfil from "./Pages/Perfil";
import ListaFichaEquipamentos from "./Pages/ListaFichaEquipamentos";
import FichaEquipamentoPage from "./Pages/FichaEquipamentoPage";
import CriarFichaEquip from "./Pages/criarFichaEquip";
import EditarFichaEquip from "./Pages/EditarFichaEquip";
import Checkout from "./Pages/Checkout";
import ComprasPage from "./Pages/ComprasPage";
import DetalhesVenda from "./Pages/DetalhesVenda";
import ReparacoesEmpregado from "./Pages/reparacoesEmpregado";
import LojasEmpregado from "./Pages/LojasEmpregado";
import ListaReparacoes from "./Pages/listaReparacoes";
import DetalhesReparacao from "./Pages/DetalhesReparacao";
import DiagnosticoReparacao from "./Pages/DiagnosticoReparacao";
import EditarReparacao from "./Pages/EditarReparacao";
import Dashboard from "./Pages/Dashboard";
import LoginEmpregado from "./Pages/LoginEmpregado";
import ComprarFisicaPage from "./Pages/ComprarFisicaPage";  
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LojasCliente from "./Pages/LojasCliente";
import ReparacoesCliente from "./Pages/reparacoesCliente";
import VenderCliente from "./Pages/venderCliente";
import DetalhesEncomendaPage from "./Pages/DetalhesEncomenda";
import Interesses from "./Pages/Interesses";
import AdicionarInteresse from "./Pages/AdicionarInteresse";
import { InteressesProvider } from "./Context/InteressesContext";


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
    <InteressesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comprar" element={<ComprarPage />} />
          <Route path="/comprarAoCliente" element={<VenderPage />} />
          <Route path="/orcamento" element={<OrcamentoPage />} />
          
          <Route path="/doar" element={<ProjetosPage />} />

          <Route path="/projeto/:id" element={<ProjetoDetalhesPage />} />

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
          <Route path="/fichas" element={<ListaFichaEquipamentos />} />
          <Route path="/ficha/:id" element={<FichaEquipamentoPage />} />
          <Route path="/criarFichaEquipamento" element={<CriarFichaEquip />} />
          <Route path="/editarFicha/:id" element={<EditarFichaEquip />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/equipamentosVendidos" element={<ComprasPage />} />
          <Route
            path="/equipamentosVendidos/:numerovenda"
            element={<DetalhesVenda />}
          />
          <Route
            path="/reparacoesEmpregado"
            element={<ReparacoesEmpregado />}
          />
          <Route path="/lojasEmpregado" element={<LojasEmpregado />} />
          <Route path="/lojasCliente" element={<LojasCliente />} />
          <Route path="/listaReparacoes" element={<ListaReparacoes />} />
          <Route path="/reparacoes/:id" element={<DetalhesReparacao />} />
          <Route
            path="/reparacoes/:id/diagnostico"
            element={<DiagnosticoReparacao />}
          />
          <Route path="/reparacoes/:id/editar" element={<EditarReparacao />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loginempregado" element={<LoginEmpregado />} />
          <Route path="/reparacoesCliente" element={<ReparacoesCliente />} />
          <Route path="/venderCliente" element={<VenderCliente />} />
          <Route path="/venderAoCliente" element={<ComprarFisicaPage />} />

          <Route
            path="/detalhesEncomenda/:numerovenda"
            element={<DetalhesEncomendaPage />}
          />
          <Route path="/interesses" element={<Interesses />} />
          <Route
            path="/adicionar-interesse"
            element={<AdicionarInteresse />}
          />
          
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </Router>
    </InteressesProvider>
    </ThemeProvider>
  );
}

export default App;
