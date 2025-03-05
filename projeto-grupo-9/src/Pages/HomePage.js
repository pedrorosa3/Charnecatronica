import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import BuildIcon from "@mui/icons-material/Build";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

const cards = [
  {
    icon: <ShoppingCartIcon fontSize="large" />,
    title: "Compra de equipamentos",
    description:
      "Explore uma ampla variedade de dispositivos eletrônicos usados, cuidadosamente selecionados para garantir qualidade e ótimo custo-benefício.",
  },
  {
    icon: <SellIcon fontSize="large" />,
    title: "Venda de equipamentos",
    description:
      "Venda os seus equipamentos eletrônicos usados de maneira segura e eficiente, ajudando a reduzir o desperdício e promovendo a economia circular.",
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
      "Doe equipamentos eletrônicos que não usa mais e contribua para iniciativas sociais, ajudando pessoas e instituições que precisam.",
  },
  {
    icon: <ShareLocationIcon fontSize="large" />,
    title: "Tracking",
    description:
      "Acompanhe o status dos seus pedidos e serviços em andamento, garantindo total transparência no processo de compra, venda ou reparação.",
  },
  {
    icon: <RequestQuoteIcon fontSize="large" />,
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
        backgroundColor: "#F5F5F5",
      }}
    >
      <Header />
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
        <Typography
          variant="body1"
          sx={{
            marginTop: "10px",
            maxWidth: "600px",
            marginX: "auto",
            color: "#444",
          }}
        ></Typography>
      </Box>

      {/*Box do grid com 2 linhas e 3 colunas*/}
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
                  backgroundColor: "#FFFFFF",
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  minHeight: "250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  {card.icon}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ marginTop: "10px" }}
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
