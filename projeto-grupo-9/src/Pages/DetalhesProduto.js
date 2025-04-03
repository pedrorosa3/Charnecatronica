import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  List,
  ListItem,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useCarrinho } from "../Context/CarrinhoContext";

const DetalhesProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false); // 👈 Novo estado
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    fetch(`http://localhost:9000/equipamentos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduto(data);
        setImagemSelecionada(data.imagens?.[0]);
      })
      .catch((err) => console.error("Erro ao buscar produto:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const layoutProps = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#F8F8F8",
  };

  const handleAdicionar = () => {
    adicionarAoCarrinho(produto);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  if (loading || !produto) {
    return (
      <Box sx={layoutProps}>
        <Header />
        <Box
          sx={{
            flex: 1,
            pt: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography>Produto não encontrado</Typography>
          )}
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={layoutProps}>
      <Header />
      <Box sx={{ flex: 1, p: 4, pt: "130px" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex" }}>
              <List
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 400,
                  overflowY: "auto",
                  mr: 2,
                }}
              >
                {produto.imagens?.map((img, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => setImagemSelecionada(img)}
                    sx={{
                      p: 1,
                      border:
                        imagemSelecionada === img
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                      mb: 1,
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Imagem ${index + 1}`}
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                  </ListItem>
                ))}
              </List>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  height: 400,
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={imagemSelecionada}
                  alt={produto.nome}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              {produto.nome}
            </Typography>
            <Typography variant="h6" color="text.secondary" mt={2}>
              {produto.preco}€
            </Typography>

            <Button
              variant="contained"
              onClick={handleAdicionar}
              sx={{ mt: 3 }}
            >
              Adicionar ao Carrinho
            </Button>

            {produto.descricao_detalhada && (
              <Paper sx={{ mt: 4, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Descrição Técnica
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {produto.descricao_detalhada}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Produto adicionado ao carrinho!
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default DetalhesProduto;
