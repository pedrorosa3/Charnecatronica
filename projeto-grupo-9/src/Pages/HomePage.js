import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";

const cards = [
  {
    title: "Compra de equipamentos",
    description:
      "Explore uma ampla variedade de dispositivos eletrônicos usados, cuidadosamente selecionados para garantir qualidade e ótimo custo-benefício.",
  },
  {
    title: "Venda de equipamentos",
    description:
      "Venda seus equipamentos eletrônicos usados de maneira segura e eficiente, ajudando a reduzir o desperdício e promovendo a economia circular.",
  },
  {
    title: "Resolução de avarias",
    description:
      "Conte com nossos especialistas para diagnosticar e reparar falhas em seus dispositivos, garantindo um funcionamento eficiente e prolongando sua vida útil.",
  },
  {
    title: "Doações de equipamentos",
    description:
      "Doe equipamentos eletrônicos que não usa mais e contribua para iniciativas sociais, ajudando pessoas e instituições que precisam.",
  },
  {
    title: "Fila de espera",
    description:
      "Acompanhe o status dos seus pedidos e serviços em andamento, garantindo total transparência no processo de compra, venda ou reparação.",
  },
  {
    title: "Orçamentos",
    description:
      "Solicite orçamentos personalizados para compra, venda ou reparo de equipamentos eletrônicos, garantindo sempre as melhores condições do mercado.",
  },
];

const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Header />

      {/* Título Fixo */}
      <Box
        sx={{
          paddingTop: "100px",
          paddingBottom: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#000" }}>
          Bem vindo à Charnecatrónica
        </Typography>
      </Box>

      {/* Grid com 6 Cartões (2 Linhas de 3 Cartões) */}
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
          {cards.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  border: "2px solid #000",
                  boxShadow: "none",
                  minHeight: "250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ marginBottom: "10px" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {card.description}
                  </Typography>
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

export default HomePage;
