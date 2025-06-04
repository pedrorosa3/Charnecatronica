import React, { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Container,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarComprar from "../Components/SidebarComprar";
import Sidebar from "../Components/SideBarDashboard";
import Footer from "../Components/Footer";


const ListaFichaEquipamentos = () => {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [preco, setPreco] = useState([0, 2000]);
  const [ordenacao, setOrdenacao] = useState("recentes");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9000/fichas")
      .then((res) => res.json())
      .then((data) => {
        setFichas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar fichas de equipamento:", err);
        setLoading(false);
      });
  }, []);

  const fichasFiltradas = useMemo(() => {
    let result = [...fichas];

    if (selectedCategories.length > 0) {
      result = result.filter((f) => selectedCategories.includes(f.tipo));
    }

    result = result.filter((f) => {
      const precoValido = parseFloat(f.precobase);
      return precoValido >= preco[0] && precoValido <= preco[1];
    });

    if (ordenacao === "recentes") {
      result.sort(
        (a, b) => new Date(b.anolancamento) - new Date(a.anolancamento)
      );
    } else if (ordenacao === "preco_asc") {
      result.sort((a, b) => parseFloat(a.precobase) - parseFloat(b.precobase));
    } else if (ordenacao === "preco_desc") {
      result.sort((a, b) => parseFloat(b.precobase) - parseFloat(a.precobase));
    }

    return result;
  }, [fichas, selectedCategories, preco, ordenacao]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Sidebar />
      <Box sx={{ display: "flex", paddingTop: "50px", marginBottom: "60px" }}>
        <Container sx={{ mt: 2, mb: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" sx={{ m: 0 }}>
              Lista de fichas de equipamento:
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/criarFichaEquipamento")}
              sx={{
                backgroundColor: "#000",
                color: "#FFF",
                borderRadius: "0px",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: 17,
                paddingX: 8,
                paddingY: 1.2,
                minWidth: "150px",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Criar Ficha
            </Button>
          </Box>
          <Grid container spacing={2}>
            {fichasFiltradas.map((ficha) => (
              <Grid item xs={12} sm={6} md={4} key={ficha.codbarras}>
                <Card
                  onClick={() => navigate(`/ficha/${ficha.codbarras}`)}
                  sx={{ cursor: "pointer", height: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <img
                      src={ficha.url || "/placeholder.jpg"}
                      alt={`${ficha.marca} ${ficha.modelo}`}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6">
                      {ficha.marca} {ficha.modelo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ficha.tipo}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
              <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50px",
          bgcolor: "#222",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1500,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Footer />
      </Box>
      </Box>
    </>
  );
};

export default ListaFichaEquipamentos;
