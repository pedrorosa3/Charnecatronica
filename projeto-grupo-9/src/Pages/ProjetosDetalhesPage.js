import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProjetoDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagemIndex, setImagemIndex] = useState(0);

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await fetch(`http://localhost:9000/projetos_beneficencia/${id}`);
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Projeto não encontrado.`);
        }
        const data = await response.json();
        const projetoRecebido = Array.isArray(data) ? data[0] : data;
        setProjeto(projetoRecebido);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (erro) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
        <Header />
        <Container maxWidth="md" sx={{ pt: "130px", pb: 5, textAlign: "center" }}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Typography variant="h5" color="error" gutterBottom>
              Erro ao carregar projeto
            </Typography>
            <Typography variant="body1" gutterBottom>
              {erro}
            </Typography>
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
                mb: 4,
                "&:hover": { backgroundColor: "#333" },
              }}
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
            >
              Voltar
            </Button>
          </motion.div>
        </Container>
        <Footer />
      </Box>
    );
  }

  let imagens = [];
  if (Array.isArray(projeto?.imagens) && projeto.imagens.length > 0) {
    imagens = projeto.imagens;
  } else if (projeto?.imagem) {
    imagens = [projeto.imagem];
  }

  const proximaImagem = () => {
    setImagemIndex((i) => (i + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setImagemIndex((i) => (i - 1 + imagens.length) % imagens.length);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Header />
      <Container maxWidth="md" sx={{ pt: "130px", pb: 5 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "50px",
              textTransform: "none",
              fontWeight: "bold",
              mb: 2,
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#333" },
            }}
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>

          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            {projeto?.nome}
          </Typography>

          {imagens.length > 0 && (
            <Box sx={{ mb: 3, textAlign: "center", position: "relative" }}>
              <Box
                sx={{
                  width: "100%",
                  height: 450,
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: 2,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imagemIndex}
                    src={imagens[imagemIndex]}
                    alt={`Imagem ${imagemIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </AnimatePresence>
              </Box>

              {imagens.length > 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    transform: "translateY(-50%)",
                  }}
                >
                  <Button onClick={imagemAnterior} variant="contained" size="small">⬅</Button>
                  <Button onClick={proximaImagem} variant="contained" size="small">➡</Button>
                </Box>
              )}
            </Box>
          )}

          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Descrição:</strong> {projeto?.descricao}
            </Typography>
            <Typography variant="body1">
              <strong>Data Limite:</strong> {new Date(projeto?.datalimite).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Quantidade de Equipamentos:</strong> {projeto?.quantidadeequipamentos}
            </Typography>
            <Typography variant="body1">
              <strong>Organizador:</strong> {projeto?.nomeorganizador}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Loja:</strong> {projeto?.nomeloja}
            </Typography>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            <Box
              sx={{
                bgcolor: "#e3f2fd",
                borderRadius: "8px",
                p: 1,
                mt: 2,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#0d47a1" }}
              >
                Dirija-se a uma das nossas lojas para doar o seu equipamento!
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
      <Footer />
    </Box>
  );
};

export default ProjetoDetalhesPage;
