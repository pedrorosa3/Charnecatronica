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
    imagem: "/images/iphone16.png",
  },
  {
    nome: "Iphone 15",
    categoria: "Telemóveis",
    preco: "699,99",
    avaliacao: 4.0,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone15.jpg",
  },
  {
    nome: "Iphone 15 Pro Max",
    categoria: "Telemóveis",
    preco: "999,99",
    avaliacao: 5.0,
    reviews: "1.2k Reviews",
    imagem: "/images/iphone15ProMax.jpg",
  },
  {
    nome: "MacBook Air",
    categoria: "Portáteis",
    preco: "1299,99",
    avaliacao: 4.5,
    reviews: "1.2k Reviews",
    imagem: "/images/macBookAir.jpg",
  },
  {
    nome: "Monitor AOC 240hz",
    categoria: "Monitores",
    preco: "399,99",
    avaliacao: 3.0,
    reviews: "1.2k Reviews",
    imagem: "/images/monitorAOC.jpg",
  },
  {
    nome: "Portátil ASUS",
    categoria: "Portáteis",
    preco: "1199,99",
    avaliacao: 5.0,
    reviews: "1.2k Reviews",
    imagem: "/images/portatilASUS.jpg",
  },
  {
    nome: "Samsung Galaxy S23",
    categoria: "Telemóveis",
    preco: "849,99",
    avaliacao: 4.7,
    reviews: "900 Reviews",
    imagem: "/images/galaxyS23.jpg",
  },
  {
    nome: "Google Pixel 7",
    categoria: "Telemóveis",
    preco: "799,99",
    avaliacao: 4.6,
    reviews: "850 Reviews",
    imagem: "/images/pixel7.jpg",
  },
  {
    nome: "Xiaomi 13 Pro",
    categoria: "Telemóveis",
    preco: "699,99",
    avaliacao: 4.3,
    reviews: "700 Reviews",
    imagem: "/images/xiaomi13Pro.jpg",
  },
  {
    nome: "Dell XPS 15",
    categoria: "Portáteis",
    preco: "1799,99",
    avaliacao: 4.8,
    reviews: "2.1k Reviews",
    imagem: "/images/dellXPS15.jpg",
  },
  {
    nome: "HP Spectre x360",
    categoria: "Portáteis",
    preco: "1399,99",
    avaliacao: 4.6,
    reviews: "1.5k Reviews",
    imagem: "/images/hpSpectre.jpg",
  },
  {
    nome: "Lenovo ThinkPad X1 Carbon",
    categoria: "Portáteis",
    preco: "1599,99",
    avaliacao: 4.7,
    reviews: "1.8k Reviews",
    imagem: "/images/lenovoThinkPad.jpg",
  },
  {
    nome: "Samsung Smart Monitor M7",
    categoria: "Monitores",
    preco: "499,99",
    avaliacao: 4.4,
    reviews: "600 Reviews",
    imagem: "/images/samsungM7.jpg",
  },
  {
    nome: "LG UltraFine 5K",
    categoria: "Monitores",
    preco: "1299,99",
    avaliacao: 4.5,
    reviews: "500 Reviews",
    imagem: "/images/lgUltraFine.jpg",
  },
  {
    nome: "BenQ EX3501R",
    categoria: "Monitores",
    preco: "799,99",
    avaliacao: 4.3,
    reviews: "700 Reviews",
    imagem: "/images/benQEX3501R.jpg",
  },
  {
    nome: "Asus ROG Swift PG259QN",
    categoria: "Monitores",
    preco: "699,99",
    avaliacao: 4.9,
    reviews: "850 Reviews",
    imagem: "/images/asusROGSwift.jpg",
  },
  {
    nome: "Apple iPad Pro 12.9",
    categoria: "Tablets",
    preco: "1199,99",
    avaliacao: 4.8,
    reviews: "2k Reviews",
    imagem: "/images/ipadPro12.jpeg",
  },
  {
    nome: "Samsung Galaxy Tab S8",
    categoria: "Tablets",
    preco: "899,99",
    avaliacao: 4.5,
    reviews: "1.4k Reviews",
    imagem: "/images/galaxyTabS8.jpg",
  },
  {
    nome: "Microsoft Surface Pro 9",
    categoria: "Tablets",
    preco: "1099,99",
    avaliacao: 4.7,
    reviews: "1.3k Reviews",
    imagem: "/images/surfacePro9.jpg",
  },
  {
    nome: "Amazon Fire HD 10",
    categoria: "Tablets",
    preco: "199,99",
    avaliacao: 4.1,
    reviews: "1k Reviews",
    imagem: "/images/amazonFireHD.jpg",
  },
];

const ComprarPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [preco, setPreco] = useState([0, 2000]);
  const [selectedOfertas, setSelectedOfertas] = useState([]);

  // Verifica se algum filtro além do preço está ativo
  const filtrosAtivos =
    selectedCategories.length > 0 || selectedOfertas.length > 0;

  // Filtragem dos produtos
  const produtosFiltrados = produtos.filter((produto) => {
    const precoNumerico = parseFloat(produto.preco.replace(",", "."));

    const categoriaMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(produto.categoria);

    // Por enquanto, não temos dados de "ofertas" nos produtos
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
          {/* Se filtros estão ativos e não há produtos correspondentes */}
          {filtrosAtivos && produtosFiltrados.length === 0 ? (
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

                      {/* Botão Adicionar ao Carrinho */}
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
