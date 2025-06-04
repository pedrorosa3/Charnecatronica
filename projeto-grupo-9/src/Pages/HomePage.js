import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import BuildIcon from "@mui/icons-material/Build";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import OfertasDestaqueSection from "../Components/OfertasDestaqueSection";

const cards = [
  {
    icon: <ShoppingCartIcon fontSize="large" />,
    title: "Compra de equipamentos",
    description:
      "Explore uma ampla variedade de dispositivos eletrónicos usados, cuidadosamente selecionados para garantir qualidade e ótimo custo-benefício.",
  },
  {
    icon: <SellIcon fontSize="large" />,
    title: "Venda de equipamentos",
    description:
      "Venda os seus equipamentos eletrónicos usados de forma segura e eficiente, ajudando a reduzir o desperdício e promovendo a economia circular.",
  },
  {
    icon: <BuildIcon fontSize="large" />,
    title: "Resolução de avarias",
    description:
      "Conte com os nossos especialistas para diagnosticar e reparar falhas em seus dispositivos, garantindo um funcionamento eficiente e prolongando sua vida útil.",
  },
  {
    icon: <VolunteerActivismIcon fontSize="large" />,
    title: "Doações de equipamentos",
    description:
      "Doe equipamentos eletrónicos que não usa mais e contribua para iniciativas sociais, ajudando pessoas e instituições que precisam.",
  },
];

const HomePage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Secção de boas-vindas */}
      <Box
        sx={{
          paddingTop: "120px",
          paddingBottom: "30px",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#222" }}>
          BEM VINDO À
        </Typography>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            backgroundColor: "#222",
            color: "#FFFFFF",
            display: "inline-block",
            padding: "5px 15px",
            borderRadius: "8px",
          }}
        >
          CHARNECATRÓNICA
        </Typography>
      </Box>

      {/* Grid com funcionalidades */}
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
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  height: "250px", // mesmo tamanho para todos
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <CardContent sx={{ padding: 0 }}>
                  {card.icon}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ marginTop: "10px" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Ofertas em destaque */}
      <Box id="destaques" sx={{ backgroundColor: "#f7f7f7", py: 6 }}>
        <OfertasDestaqueSection />
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;
