import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Rating,
  Chip,
  CircularProgress,
  Grow,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SidebarComprar from "../Components/SidebarComprar";
import { useCarrinho } from "../Context/CarrinhoContext";
import { useNavigate } from "react-router-dom";

const ComprarPage = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [preco, setPreco] = useState([0, 2000]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [ordenacao, setOrdenacao] = useState("recentes");
  const [selectedEstados, setSelectedEstados] = useState([]);

  const { adicionarAoCarrinho, carrinho } = useCarrinho();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("API HOST:", process.env.REACT_APP_URL_HOST);

    fetch(process.env.REACT_APP_URL_HOST + "/equipamentos")
      .then((res) => res.json())
      .then((data) => {
        const dadosCorrigidos = data.map((item) => ({
          ...item,
          dataDeDisponibilizacao: item.datadedisponibilizacao, // corrige o nome
        }));

        console.log("Equipamentos corrigidos:", dadosCorrigidos);
        setEquipamentos(dadosCorrigidos);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err))
      .finally(() => setLoading(false));
  }, []);

  const produtosFiltrados = React.useMemo(() => {
    if (!equipamentos || equipamentos.length === 0) return [];

    let filtrados = equipamentos.filter((produto) => {
      const precoNumerico = parseFloat(produto.preco);
      const categoriaMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(produto.categoria);
      const precoMatch = precoNumerico >= preco[0] && precoNumerico <= preco[1];
      const estadoMatch =
        selectedEstados.length === 0 ||
        selectedEstados.includes(produto.estado);
      return categoriaMatch && precoMatch && estadoMatch;
    });

    if (ordenacao === "recentes") {
      filtrados.sort((a, b) => {
        const dateA = new Date(a.dataDeDisponibilizacao || 0);
        const dateB = new Date(b.dataDeDisponibilizacao || 0);
        return dateB - dateA;
      });
    } else if (ordenacao === "preco_asc") {
      filtrados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
    } else if (ordenacao === "preco_desc") {
      filtrados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
    }
    console.log(
      "Ordenados:",
      filtrados.map((p) => `${p.nome} - ${p.dataDeDisponibilizacao}`)
    );

    return filtrados;
  }, [equipamentos, selectedCategories, selectedEstados, preco, ordenacao]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
      }}
    >
      <Header />
      <Box sx={{ display: "flex", flex: 1, paddingTop: "90px" }}>
        <SidebarComprar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedEstados={selectedEstados}
          setSelectedEstados={setSelectedEstados}
          preco={preco}
          setPreco={setPreco}
          ordenacao={ordenacao}
          setOrdenacao={setOrdenacao}
        />

        <Box sx={{ flex: 1, padding: "20px" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : produtosFiltrados.length === 0 ? (
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ mt: 5, color: "#000" }}
            >
              Nenhum produto encontrado com os filtros selecionados.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {produtosFiltrados.map((produto, index) => (
                <Grow in={true} timeout={400 + index * 100} key={produto.id}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card
                      onClick={() => navigate(`/produto/${produto.id}`)}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "15px",
                        padding: "20px",
                        textAlign: "center",
                        position: "relative",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                        }}
                      >
                        <Chip
                          label={produto.categoria}
                          variant="outlined"
                          sx={{
                            backgroundColor: "#F5F5F5",
                            color: "#000",
                            fontSize: "12px",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                        }}
                      >
                        <Chip
                          label={produto.estado}
                          variant="outlined"
                          sx={{
                            backgroundColor: "#F5F5F5",
                            color: "#000",
                            fontSize: "12px",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {produto.nome}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                            mb: 1,
                          }}
                        >
                          <Rating
                            value={produto.avaliacao}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, color: "gray" }}
                          >
                            {produto.reviews}
                          </Typography>
                        </Box>
                        <Typography variant="h6">{produto.preco}€</Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();

                            const jaExiste = carrinho.some(
                              (item) => item.id === produto.id
                            );

                            if (jaExiste) {
                              setSnackbarMessage(
                                "O produto já se encontra no carrinho"
                              );
                            } else {
                              adicionarAoCarrinho({
                                ...produto,
                                quantidade: 1,
                              });
                              setSnackbarMessage(
                                "Produto adicionado ao carrinho"
                              );
                            }

                            setSnackbarOpen(true);
                          }}
                          sx={{
                            backgroundColor: "#000",
                            color: "#FFFFFF",
                            borderRadius: "50px",
                            textTransform: "none",
                            fontWeight: "bold",
                            marginTop: "15px",
                            "&:hover": { backgroundColor: "#333" },
                          }}
                        >
                          Adicionar ao Carrinho
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
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

export default ComprarPage;
