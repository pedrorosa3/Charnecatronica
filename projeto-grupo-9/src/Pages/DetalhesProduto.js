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
  Rating,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useCarrinho } from "../Context/CarrinhoContext";

const DetalhesProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { adicionarAoCarrinho, carrinho } = useCarrinho();

  useEffect(() => {
    fetch(process.env.REACT_APP_URL_HOST+`/equipamentos/${id}`)
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
    if (!produto) return;

    const jaExiste = carrinho.some((item) => item.id === produto.id);

    if (jaExiste) {
      setSnackbarMessage("O produto já se encontra no carrinho");
      setOpenSnackbar(true);
      return;
    }

    const produtoComQuantidade = {
      id: produto.id,
      nome: produto.nome,
      modelo: produto.modelo,
      tipo: produto.tipo,
      marca: produto.marca,
      preco: Number(produto.preco),
      imagem: produto.imagens?.[0] || "/placeholder.png",
      quantidade: 1,
      estado: produto.estado,
    };

    adicionarAoCarrinho(produtoComQuantidade);
    setSnackbarMessage("Produto adicionado ao carrinho!");
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
        <Grid container spacing={10}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex" }}>
              <List
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 500,
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
                      backgroundColor: "#fff",
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
                  borderRadius: "8px",
                  height: 600,
                  ml: 1,
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
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#fff", mr: 15 }}>
              <Typography variant="h4" fontWeight="bold">
                {`${produto.marca} ${produto.modelo} - ${produto.estado}`}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Rating
                  value={produto.avaliacao || 0}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" sx={{ ml: 1, color: "gray" }}>
                  {produto.reviews || "Sem avaliações"}
                </Typography>
              </Box>

              {produto.especificacoes?.length > 0 && (
                <Box sx={{ p: 2 }}>
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {produto.especificacoes.map((esp, index) => (
                      <li key={index}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: esp.destaque ? "bold" : "normal",
                          }}
                        >
                          {esp.titulo}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="green" mb={1}>
                  ✔ Envio gratuito
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Entrega estimada: <strong>3-5 dias úteis</strong>
                </Typography>
              </Box>

              <Box sx={{ mt: -11 }}>
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ textAlign: "right" }}
                >
                  {Number(produto.preco).toFixed(2)}€
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleAdicionar}
                    sx={{ height: 40 }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </Box>
              </Box>

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
            </Paper>
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
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default DetalhesProduto;
