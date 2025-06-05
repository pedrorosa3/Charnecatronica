import React from "react";
import { Box, Typography, Avatar, Paper, IconButton } from "@mui/material";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const testemunhos = [
  {
    nome: "Joana Silva",
    texto:
      "Vendi o meu portátil antigo na Charnecatrónica e fui super bem atendida. Rápido, justo e sem complicações! Recomendo!",
  },
  {
    nome: "Carlos Almeida",
    texto:
      "Fiquei impressionado com a qualidade dos equipamentos usados. Comprei um smartphone como novo por metade do preço. Atendimento 5 estrelas!",
  },
  {
    nome: "Rita Santos",
    texto:
      "A minha impressora estava com problemas e resolveram em 2 dias. Serviço de reparação muito profissional, com garantia incluída. Voltarei sempre que precisar!",
  },
  {
    nome: "Miguel Fernandes",
    texto:
      "Comprei um monitor excelente a um preço acessível. Funcionários prestáveis e entrega rápida. A experiência foi muito positiva.",
  },
  {
    nome: "Ana Costa",
    texto:
      "Foi muito fácil doar o meu antigo tablet. Atendimento impecável e muito simpáticos. Fiquei feliz por saber que será reaproveitado por alguém que precisa.",
  },
  {
    nome: "Tiago Lopes",
    texto:
      "Repararam o meu portátil mais rápido do que o previsto. Excelente experiência, explicaram tudo com clareza e cumpriram os prazos.",
  },
];

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      left: -16,
      transform: "translateY(-50%)",
      zIndex: 1,
      color: "#000",
      bgcolor: "#fff",
      "&:hover": { bgcolor: "#eee" },
    }}
  >
    <ArrowBackIos fontSize="small" />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      right: -42,
      transform: "translateY(-50%)",
      zIndex: 1,
      color: "#000",
      bgcolor: "#fff",
      "&:hover": { bgcolor: "#eee" },
    }}
  >
    <ArrowForwardIos fontSize="small" />
  </IconButton>
);

const settings = {
  dots: true,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1280,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 960,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 1 },
    },
  ],
};

function Testemunhos() {
  return (
    <Box sx={{ backgroundColor: "#fff", py: 6, mb: 6 }}>
      <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 4 }}>
        O que dizem os nossos clientes:
      </Typography>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 1, position: "relative" }}>
        <Slider {...settings}>
          {testemunhos.map((t, index) => (
            <Box key={index} px={1.5} mb={2}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  ml: 2,
                  mr: 2,
                  borderRadius: 3,
                  height: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Avatar sx={{ bgcolor: "#222", mb: 2 }}>
                  {t.nome.charAt(0)}
                </Avatar>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {t.nome}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  "{t.texto}"
                </Typography>
              </Paper>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

export default Testemunhos;
