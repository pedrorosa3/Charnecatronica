import React, { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import SidebarComprar from "../Components/SidebarComprar"; // ✅ importa a sidebar

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
      <Header />
      <Box sx={{ display: "flex", paddingTop: "90px" }}>
        <SidebarComprar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          preco={preco}
          setPreco={setPreco}
          ordenacao={ordenacao}
          setOrdenacao={setOrdenacao}
        />

        <Container sx={{ mt: 2, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Lista de fichas de equipamento:
          </Typography>
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
                      src={ficha.imagemurl || "/placeholder.jpg"}
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
      </Box>
    </>
  );
};

export default ListaFichaEquipamentos;
