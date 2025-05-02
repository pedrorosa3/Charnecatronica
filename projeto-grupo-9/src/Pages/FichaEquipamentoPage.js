import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";

const FichaEquipamentoPage = () => {
  const { id } = useParams();
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:9000/fichas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFicha(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar ficha de equipamento:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (!ficha)
    return (
      <Typography variant="h6" align="center">
        Ficha não encontrada.
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={ficha.imagemUrl || "/placeholder.jpg"}
            alt={`${ficha.marca} ${ficha.modelo}`}
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {ficha.marca} {ficha.modelo}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Tipo: {ficha.tipo}
            </Typography>
            <Typography variant="body1">
              Código de barras (EAN-13): {ficha.cod_barras}
            </Typography>
            <Typography variant="body1">
              Ano de lançamento: {ficha.ano_lancamento}
            </Typography>
            <Typography variant="body1">
              Preço base de referência: €{parseFloat(ficha.preco).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default FichaEquipamentoPage;
