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
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SidebarComprar from "../Components/SidebarComprar";

const ComprarPage = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [preco, setPreco] = useState([0, 2000]);
  const [selectedOfertas, setSelectedOfertas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9000/equipamentos")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setEquipamentos(data);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  const produtosFiltrados = equipamentos.filter((produto) => {
    const precoNumerico = parseFloat(produto.preco);
    const categoriaMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(produto.categoria);
    const precoMatch = precoNumerico >= preco[0] && precoNumerico <= preco[1];

    return categoriaMatch && precoMatch;
  });

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

      <Box sx={{ display: "flex", flex: 1, paddingTop: "80px" }}>
        <SidebarComprar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          preco={preco}
          setPreco={setPreco}
          selectedOfertas={selectedOfertas}
          setSelectedOfertas={setSelectedOfertas}
        />

        <Box sx={{ flex: 1, padding: "20px" }}>
          {produtosFiltrados.length === 0 ? (
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ mt: 5, color: "#000" }}
            >
              Nenhum produto encontrado com os filtros selecionados.
            </Typography>
          ) : (
            <Grid
              container
              spacing={3}
              sx={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}
            >
              {produtosFiltrados.map((produto, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "15px",
                      padding: "20px",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{ position: "absolute", top: "10px", right: "10px" }}
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
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ComprarPage;
