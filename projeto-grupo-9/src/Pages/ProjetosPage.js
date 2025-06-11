import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const modalStyle = {
  position: "relative",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  maxHeight: "80vh",
  overflowY: "auto",
};

const ProjetosPage = () => {
  const [projetos, setProjetos] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemAtual, setImagemAtual] = useState(0);

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
    setImagemAtual(0);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setProjetoSelecionado(null);
  };

  const handleNextImage = () => {
    if (!projetoSelecionado) return;
    setImagemAtual((prev) => (prev + 1) % (projetoSelecionado.imagens.length || 1));
  };

  const handlePrevImage = () => {
    if (!projetoSelecionado) return;
    setImagemAtual((prev) =>
      (prev - 1 + (projetoSelecionado.imagens.length || 1)) % (projetoSelecionado.imagens.length || 1)
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Header />

      <Container maxWidth="lg" sx={{ flex: 1, pt: "130px", pb: 5 }}>
        <Typography
          variant="h4"
          sx={{ mb: 6, fontWeight: 600, textAlign: "center" }}
        >
          Projetos de Beneficência
        </Typography>

        <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
          <Grid container spacing={4}>
            {projetos.map((projeto, index) => (
              <Grid item xs={12} sm={6} md={6} key={projeto.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ height: "100%" }}
                >
                  <Card sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 350 }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={projeto.imagem || "/images/default.jpg"}
                      alt={projeto.nome}
                    />
                    <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <Typography variant="h6">{projeto.nome}</Typography>

                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Data Limite:</strong> {new Date(projeto.datalimite).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Organizador:</strong> {projeto.nomeorganizador}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Loja:</strong> {projeto.nomeloja}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Box
                          sx={{
                            bgcolor: "#e3f2fd",
                            borderRadius: "8px",
                            p: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#0d47a1" }}>
                            Dirija-se a uma das nossas lojas para doar o seu equipamento!
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            backgroundColor: "#000",
                            color: "#fff",
                            borderRadius: "50px",
                            textTransform: "none",
                            fontWeight: "bold",
                            mt: 2,
                            "&:hover": { backgroundColor: "#333" },
                          }}
                          onClick={() => handleAbrirDetalhes(projeto)}
                        >
                          Mais detalhes
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Footer />

      <AnimatePresence>
        {modalAberto && projetoSelecionado && (
          <Modal
            open={modalAberto}
            onClose={handleFecharModal}
            closeAfterTransition
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ width: 420, maxHeight: "80vh", overflowY: "auto", backgroundColor: "transparent" }}
            >
              <Box sx={modalStyle}>
                <IconButton
                  onClick={handleFecharModal}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  aria-label="fechar"
                >
                  <CloseIcon />
                </IconButton>

                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  {projetoSelecionado.nome}
                </Typography>

                {projetoSelecionado.imagens && projetoSelecionado.imagens.length > 0 ? (
                  <Box sx={{ position: "relative", mb: 2, textAlign: "center" }}>
                    <img
                      src={projetoSelecionado.imagens[imagemAtual]}
                      alt={`${projetoSelecionado.nome} - imagem ${imagemAtual + 1}`}
                      style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                    />
                    {projetoSelecionado.imagens.length > 1 && (
                      <>
                        <Button
                          onClick={handlePrevImage}
                          sx={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}
                        >
                          ‹
                        </Button>
                        <Button
                          onClick={handleNextImage}
                          sx={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }}
                        >
                          ›
                        </Button>
                      </>
                    )}
                    <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                      Imagem {imagemAtual + 1} de {projetoSelecionado.imagens.length}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Sem imagens adicionais.
                  </Typography>
                )}

                <Typography variant="body1" sx={{ mb: 1 }}>
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
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Loja:</strong> {projetoSelecionado.nomeloja}
                </Typography>

                <Box
                  sx={{
                    bgcolor: "#e3f2fd",
                    borderRadius: "8px",
                    p: 1,
                    mt: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "#0d47a1" }}>
                    Dirija-se a uma das nossas lojas para doar o seu equipamento!
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 1,
                    backgroundColor: "#000",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                  onClick={handleFecharModal}
                >
                  Fechar
                </Button>
              </Box>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ProjetosPage;
