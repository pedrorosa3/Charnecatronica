import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const FichaEquipamentoPage = () => {
  const { id } = useParams();
  const [ficha, setFicha] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:9000/fichas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFicha(data);
        setImagemSelecionada(data.imagens?.[0]);
      })
      .catch((err) => console.error("Erro ao buscar ficha:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !ficha) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            pt: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography>Ficha não encontrada</Typography>
          )}
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ flex: 1, p: 4, pt: "130px" }}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex" }}>
              <List
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 500,
                  overflowY: "auto",
                  mr: 2,
                }}
              >
                {ficha.imagens?.map((img, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => setImagemSelecionada(img)}
                    sx={{
                      p: 1,
                      border:
                        imagemSelecionada === img
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                      mb: 1,
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Imagem ${index + 1}`}
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  height: 600,
                  ml: 1,
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={imagemSelecionada}
                  alt={`${ficha.marca} ${ficha.modelo}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#fff", mr: 15 }}>
              <Typography variant="h4" fontWeight="bold">
                {ficha.marca} {ficha.modelo}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Código de barras (EAN-13):</strong> {ficha.codbarras}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Marca:</strong> {ficha.marca}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Modelo:</strong> {ficha.modelo}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Tipo:</strong> {ficha.tipo}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Preço base de referência: </strong>
                  {parseFloat(ficha.precobase).toFixed(2)}€
                </Typography>
                <Typography variant="body1">
                  <strong>Ano de lançamento:</strong> {ficha.anolancamento}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default FichaEquipamentoPage;
