import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import BuildIcon from "@mui/icons-material/Build";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import OfertasDestaqueSection from "../Components/OfertasDestaqueSection";
import { Link } from "react-router-dom";
import Testemunhos from "../Components/Testemunhos";

const cards = [
  {
    icon: <ShoppingCartIcon fontSize="large" />,
    title: "Compra de equipamentos",
    description:
      "Explore uma ampla variedade de dispositivos eletrónicos usados, cuidadosamente selecionados para garantir qualidade e ótimo custo-benefício.",
    route: "/comprar",
  },
  {
    icon: <SellIcon fontSize="large" />,
    title: "Venda de equipamentos",
    description:
      "Venda os seus equipamentos eletrónicos usados de forma segura e eficiente, ajudando a reduzir o desperdício e promovendo a economia circular.",
    route: "/venderCliente",
  },
  {
    icon: <BuildIcon fontSize="large" />,
    title: "Resolução de avarias",
    description:
      "Conte com os nossos especialistas para diagnosticar e reparar falhas nos seus dispositivos, garantindo um funcionamento eficiente e prolongando a sua vida útil.",
    route: "/reparacoesCliente",
  },
  {
    icon: <VolunteerActivismIcon fontSize="large" />,
    title: "Doações de equipamentos",
    description:
      "Doe equipamentos eletrónicos que já não usa e contribua para iniciativas sociais, ajudando pessoas e instituições que precisam.",
    route: "/doar",
  },
];

const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Secção de boas-vindas */}
      <Box
        sx={{ paddingTop: "120px", paddingBottom: "30px", textAlign: "center" }}
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
          {cards.map((card, index) => {
            const isHovered = hoveredCard === index;
            const content = (
              <Card
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  height: "250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: isHovered ? "flex-start" : "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px",
                  transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  cursor: "pointer",
                }}
              >
                <CardContent sx={{ padding: 0, width: "100%" }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {card.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      marginTop: "10px",
                      marginBottom: isHovered ? "15px" : "0px",
                      transition: "margin 0.4s ease, transform 0.4s ease",
                      transform: isHovered
                        ? "translateY(-5px)"
                        : "translateY(0)",
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Box
                    sx={{
                      maxHeight: isHovered ? "200px" : "0px",
                      opacity: isHovered ? 1 : 0,
                      overflow: "hidden",
                      transition: "all 0.5s ease",
                      transform: isHovered
                        ? "translateY(0)"
                        : "translateY(-10px)",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );

            return (
              <Grid item key={index} xs={12} sm={6} md={3}>
                {card.route ? (
                  <Link to={card.route} style={{ textDecoration: "none" }}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Ofertas em destaque */}
      <Box id="destaques" sx={{ backgroundColor: "#f7f7f7", py: 6 }}>
        <OfertasDestaqueSection />
      </Box>
      <Testemunhos />

      <Footer />
    </Box>
  );
};

export default HomePage;
