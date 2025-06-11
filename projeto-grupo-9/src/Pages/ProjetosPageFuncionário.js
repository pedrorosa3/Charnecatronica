import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
  Button,
  Modal,
} from "@mui/material";
import Sidebar from "../Components/SideBarDashboard";
import Footer from "../Components/Footer";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const ProjetosPageFuncionario = () => {
  const [projetos, setProjetos] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await fetch("http://localhost:9000/projetos_beneficencia");
        if (!response.ok) throw new Error("Erro ao buscar projetos");
        const data = await response.json();
        setProjetos(data);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    fetchProjetos();
  }, []);

  const handleAbrirDetalhes = (projeto) => {
    setProjetoSelecionado(projeto);
    setModalAberto(true);
  };

  const handleExcluirProjeto = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      const response = await fetch(`http://localhost:9000/projetos_beneficencia/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Erro ao excluir projeto: " + (errorData.error || response.statusText));
        return;
      }

      setProjetos((prev) => prev.filter((proj) => proj.id !== id));
    } catch (error) {
      alert("Erro ao excluir projeto: " + error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Sidebar />
      <Container maxWidth="lg" sx={{ flex: 1, pt: "100px", pb: 5, pl: 10 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Projetos de Beneficência
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "50px",
              fontWeight: "bold",
              px: 3,
              py: 1.5,
              textTransform: "none",
              "&:hover": { backgroundColor: "#333" },
            }}
            onClick={() => navigate("/adicionar-projeto")}
          >
            Adicionar Novo Projeto
          </Button>
        </Box>

        <Box sx={{ maxHeight: "500px", overflowY: "auto", pr: 1 }}>
          <Grid container spacing={4}>
            {projetos.map((projeto) => (
              <Grid item xs={12} sm={6} md={4} key={projeto.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "320px",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={projeto.imagem || "/images/default.jpg"}
                    alt={projeto.nome}
                  />
                  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Typography variant="h6" gutterBottom>
                      {projeto.nome}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#000",
                        color: "#FFFFFF",
                        borderRadius: "50px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#333" },
                      }}
                      onClick={() => handleAbrirDetalhes(projeto)}
                    >
                      Mais detalhes
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        mt: 1,
                        borderRadius: "50px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                      onClick={() => handleExcluirProjeto(projeto.id)}
                    >
                      Excluir
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
        <Box sx={modalStyle}>
          {projetoSelecionado && (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                {projetoSelecionado.nome}
              </Typography>
              <Typography><strong>Descrição:</strong> {projetoSelecionado.descricao}</Typography>
              <Typography><strong>Data Limite:</strong> {new Date(projetoSelecionado.datalimite).toLocaleDateString()}</Typography>
              <Typography><strong>Quantidade de Equipamentos:</strong> {projetoSelecionado.quantidadeequipamentos}</Typography>
              <Typography><strong>Organizador:</strong> {projetoSelecionado.nomeorganizador}</Typography>
              <Typography><strong>Loja:</strong> {projetoSelecionado.nomeloja}</Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, backgroundColor: "#000", "&:hover": { backgroundColor: "#333" } }}
                onClick={() => setModalAberto(false)}
              >
                Fechar
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Footer fixo */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50px",
          bgcolor: "#222",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1500,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};

export default ProjetosPageFuncionario;
