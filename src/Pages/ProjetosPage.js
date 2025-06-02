import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
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
import Header from "../Components/Header";
import Footer from "../Components/Footer";

// Estilo do Modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const ProjetosPage = () => {
  const [projetos, setProjetos] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await fetch("http://localhost:9000/projetos_beneficencia");
        if (!response.ok) {
          throw new Error("Erro ao buscar projetos");
        }
        const data = await response.json();
        setProjetos(data);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    fetchProjetos();
  }, []);

  // Função para abrir o modal com os detalhes do projeto
  const handleAbrirDetalhes = (projeto) => {
    setProjetoSelecionado(projeto);
    setModalAberto(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Header />

      <Container sx={{ flex: 1, paddingTop: "80px", paddingBottom: "40px" }}>
        <Typography variant="h4" sx={{ marginTop: "40px", marginBottom: "50px", fontWeight: 600, textAlign: "center" }}>
          Projetos de Beneficência
        </Typography>

        {/* Box com Scroll */}
        <Box sx={{ maxHeight: "500px", overflowY: "auto", paddingRight: "10px", }}>
          <Grid container spacing={4}>
            {projetos.map((projeto) => (
              <Grid item xs={12} sm={6} md={4} key={projeto.id}>
                <Card sx={{ maxWidth: 345, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia component="img" height="200" image={projeto.imagem || "/images/default.jpg"} alt={projeto.nome} />
                  <CardContent>
                    <Typography variant="h6">{projeto.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {projeto.descricao}
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
                        marginTop: "15px",
                        "&:hover": { backgroundColor: "#333" },
                      }}
                      onClick={() => handleAbrirDetalhes(projeto)}
                    >
                      Mais detalhes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Footer />

      {/* Modal para exibir detalhes do projeto */}
      <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
        <Box sx={modalStyle}>
          {projetoSelecionado && (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                {projetoSelecionado.nome}
              </Typography>
              <Typography variant="body1">
                <strong>Descrição:</strong> {projetoSelecionado.descricao}
              </Typography>
              <Typography variant="body1">
                <strong>Data Limite:</strong> {new Date(projetoSelecionado.datalimite).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Quantidade de Equipamentos:</strong> {projetoSelecionado.quantidadeequipamentos}
              </Typography>
              <Typography variant="body1">
                <strong>Organizador:</strong> {projetoSelecionado.nomeorganizador}
              </Typography>
              <Typography variant="body1">
                <strong>Loja:</strong> {projetoSelecionado.nomeloja}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ marginTop: 2, backgroundColor: "#000", "&:hover": { backgroundColor: "#333" } }}
                onClick={() => setModalAberto(false)}
              >
                Fechar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjetosPage;
