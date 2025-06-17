import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Custom arrows
const PrevArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: "absolute",
      left: -25,
      top: "45%",
      zIndex: 1,
      cursor: "pointer",
    }}
  >
    <ArrowBackIosIcon />
  </Box>
);

const NextArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: "absolute",
      right: -25,
      top: "45%",
      zIndex: 1,
      cursor: "pointer",
    }}
  >
    <ArrowForwardIosIcon />
  </Box>
);

const OfertasDestaqueSection = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  const fetchEquipamentos = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_URL_HOST+"/equipamentos");
      const data = await response.json();
      const filtrados = data
        .filter((eq) => eq.estadovenda === "À venda")
        .slice(0, 8);

      setEquipamentos(filtrados);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
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

  return (
    <Box
      sx={{
        px: 2,
        overflow: "visible",
        maxWidth: "100%",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        sx={{ fontSize: "2rem" }}
      >
        Produtos em destaque:
      </Typography>

      <Box
        sx={{
          maxWidth: "96%",
          mx: "auto",
          overflow: "visible",
          "& .slick-slide > div": {
            px: 1,
          },
        }}
      >
        <Slider {...settings}>
          {equipamentos.map((eq) => (
            <Card
              key={eq.id}
              sx={{
                borderRadius: "10px",
                boxShadow: 2,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}
            >
              <Box
                sx={{
                  height: "160px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  image={eq.imagem || "/images/placeholder.jpg"}
                  alt={eq.nome}
                  sx={{
                    height: "100%",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <CardContent sx={{ padding: "14px" }}>
                <Chip
                  size="small"
                  label={eq.estado}
                  sx={{
                    mb: 1,
                    fontSize: "0.75rem",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                  }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  {eq.marca}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {eq.modelo}
                </Typography>
                <Typography fontWeight="bold" color="black">
                  {Number(eq.preco).toFixed(2)} €
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/produto/${eq.id}`)}
                  sx={{
                    mt: 2,
                    backgroundColor: "#000",
                    color: "#fff",
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#222",
                    },
                  }}
                >
                  Ver Produto
                </Button>
              </CardContent>
            </Card>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default OfertasDestaqueSection;
