import React, { useState } from "react";
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

const produtos = [
  {
    nome: "Iphone 16",
    categoria: "Telemóveis",
    preco: "799,99",
    avaliacao: 4.5,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone16.png", // Substituir com imagem real
  },
  {
    nome: "Iphone 15",
    categoria: "Telemóveis",
    preco: "699,99",
    avaliacao: 4.0,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone15.jpg", // Substituir com imagem real
  },
  {
    nome: "Iphone 15 Pro Max",
    categoria: "Telemóveis",
    preco: "999,99",
    avaliacao: 5.0,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone15ProMax.jpg", // Substituir com imagem real
  },
  {
    nome: "MacBook Air",
    categoria: "Portáteis",
    preco: "1299,99",
    avaliacao: 4.5,
    reviews: "1.2k Reviews",
    imagem: "/images/macBookAir.jpg", // Substituir com imagem real
  },
  {
    nome: "Monitor AOC 240hz",
    categoria: "Monitores",
    preco: "399,99",
    avaliacao: 3.0,
    reviews: "1.2k Reviews",
    imagem: "/images/monitorAOC.jpg", // Substituir com imagem real
  },
  {
    nome: "Portátil ASUS",
    categoria: "Portáteis",
    preco: "1199,99",
    avaliacao: 5.0,
    reviews: "1.2k Reviews",
    imagem: "/images/portatilASUS.jpg", // Substituir com imagem real
  },
];

const ComprarPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]); // Nenhuma categoria selecionada por padrão
  const [preco, setPreco] = useState([0, 2000]); // Faixa de preço completa
  const [selectedOfertas, setSelectedOfertas] = useState([]); // Nenhuma oferta selecionada

  const produtosFiltrados = produtos.filter((produto) => {
    // Corrigir erro na conversão do preço
    const precoNumerico = parseFloat(
      produto.preco.replace("€", "").replace(",", ".")
    );

    const categoriaMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(produto.categoria);
    const precoMatch = precoNumerico >= preco[0] && precoNumerico <= preco[1];

    return categoriaMatch && precoMatch;
  });

  console.log("Produtos filtrados:", produtosFiltrados);

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
        {/* Sidebar */}
        <SidebarComprar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          preco={preco}
          setPreco={setPreco}
          selectedOfertas={selectedOfertas}
          setSelectedOfertas={setSelectedOfertas}
        />
        {/* Grid de Produtos */}
        <Box sx={{ flex: 1, padding: "20px" }}>
          {produtosFiltrados.length === 0 ? (
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ mt: 5, color: "#000" }}
            >
              Nenhum produto encontrado.
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
                      sx={{ display: "flex", justifyContent: "center", mb: 2 }}
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
                          "&:hover": {
                            backgroundColor: "#333",
                          },
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
