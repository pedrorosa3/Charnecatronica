import React from "react";
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
    preco: "799,99€",
    avaliacao: 4.5,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone16.png", // Substituir com imagem real
  },
  {
    nome: "Iphone 15",
    categoria: "Telemóveis",
    preco: "699,99€",
    avaliacao: 4.0,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone15.jpg", // Substituir com imagem real
  },
  {
    nome: "Iphone 15 Pro Max",
    categoria: "Telemóveis",
    preco: "999,99€",
    avaliacao: 5.0,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone15ProMax.jpg", // Substituir com imagem real
  },
  {
    nome: "MacBook Air",
    categoria: "Portáteis",
    preco: "1299,99€",
    avaliacao: 4.5,
    reviews: "1.2k Reviews",
    imagem: "/images/macBookAir.jpg", // Substituir com imagem real
  },
  {
    nome: "Monitor AOC 240hz",
    categoria: "Monitores",
    preco: "399,99€",
    avaliacao: 3.0,
    reviews: "1.2k Reviews",
    imagem: "/images/monitorAOC.jpg", // Substituir com imagem real
  },
  {
    nome: "Portátil ASUS",
    categoria: "Portáteis",
    preco: "1199,99€",
    avaliacao: 5.0,
    reviews: "1.2k Reviews",
    imagem: "/images/portatilASUS.jpg", // Substituir com imagem real
  },
];

const ComprarPage = () => {
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

      <Box
        sx={{ paddingTop: "100px", textAlign: "center", paddingBottom: "20px" }}
      ></Box>

      {/* Grid de Produtos */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "40px",
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ maxWidth: "1200px" }}
        >
          {produtos.map((produto, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                  textAlign: "center",
                  position: "relative", // Permite que elementos internos fiquem absolutos
                }}
              >
                {/* Categoria no canto superior direito */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 2, // Garante que fique acima do conteúdo
                  }}
                >
                  <Chip
                    label={produto.categoria}
                    variant="outlined"
                    sx={{
                      backgroundColor: "#F5F5F5",
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  />
                </Box>

                {/* Imagem */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
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
                  {/* Nome do Produto */}
                  <Typography variant="h6" fontWeight="bold">
                    {produto.nome}
                  </Typography>

                  {/* Avaliação */}
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
                    <Typography variant="body2" sx={{ ml: 1, color: "gray" }}>
                      {produto.reviews}
                    </Typography>
                  </Box>

                  {/* Preço */}
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {produto.preco}
                  </Typography>

                  {/* Botões */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        backgroundColor: "#FFFFFF",
                        color: "#000",
                        border: "1px solid #000",
                        borderRadius: "50px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#F5F5F5",
                        },
                      }}
                    >
                      Adicionar ao Carrinho
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#000",
                        color: "#FFFFFF",
                        borderRadius: "50px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#333",
                        },
                      }}
                    >
                      Comprar Agora
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default ComprarPage;
