import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ListaFichaEquipamentos = () => {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={2} padding={2}>
      {fichas.map((ficha) => (
        <Grid item xs={12} sm={6} md={4} key={ficha.id}>
          <Card
            onClick={() => navigate(`/ficha/${ficha.id}`)}
            sx={{ cursor: "pointer" }}
          >
            <CardMedia
              component="img"
              height="200"
              image={ficha.imagemUrl || "/placeholder.jpg"}
              alt={ficha.marca + " " + ficha.modelo}
            />
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
  );
};

export default ListaFichaEquipamentos;
