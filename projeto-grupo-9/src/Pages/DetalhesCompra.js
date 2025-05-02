import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const DetalhesCompra = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/compraslista/${id}`
        );
        const data = await response.json();
        setCompra(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da compra:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompra();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!compra) {
    return (
      <Container>
        <Typography variant="h6" color="error" mt={4} align="center">
          Compra não encontrada.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
        marginTop: "85px",
      }}
    >
      <Header />
      <Container sx={{ flex: 1, padding: "30px", maxWidth: "900px" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
        >
          Detalhes da Compra
        </Typography>

        {/* Informações Gerais e Equipamento */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Informações Gerais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Data:</strong>{" "}
                  {new Date(compra.data).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Preço de Compra:</strong> {compra.preco.toFixed(2)}€
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Equipamento: Foto e Informações */}
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {compra.equipamentoimagemurl && (
                  <img
                    src={compra.equipamentoimagemurl}
                    alt={`${compra.equipamentomarca} ${compra.equipamentomodelo}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "250px",
                      borderRadius: "10px",
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={8} sx={{ paddingLeft: "20px" }}>
                <Typography sx={{ marginBottom: "10px" }}>
                  <strong>Tipo:</strong> {compra.equipamentotipo}
                </Typography>
                <Typography sx={{ marginBottom: "10px" }}>
                  <strong>Marca:</strong> {compra.equipamentomarca}
                </Typography>
                <Typography sx={{ marginBottom: "10px" }}>
                  <strong>Modelo:</strong> {compra.equipamentomodelo}
                </Typography>
                <Typography>
                  <strong>Ano de Lançamento:</strong>{" "}
                  {compra.equipamentoanolancamento}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Loja */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Loja
            </Typography>
            <Typography>
              <strong>Nome:</strong> {compra.lojanome}
            </Typography>
            <Typography>
              <PhoneIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
              <strong>Telefone:</strong> {compra.lojatelefone}
            </Typography>
            <Typography>
              <LocationOnIcon
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              <strong>Morada:</strong> {compra.lojarua}, Nº {compra.lojanumero},{" "}
              {compra.lojalocalidade}, {compra.lojaconcelho},{" "}
              {compra.lojadistrito}, {compra.lojacodigopostal}
            </Typography>
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Cliente
            </Typography>
            <Typography>
              <strong>Nome:</strong> {compra.clientenome}
            </Typography>
            <Typography>
              <PhoneIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
              <strong>Telemóvel:</strong> {compra.clientetelemovel}
            </Typography>
            <Typography>
              <EmailIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
              <strong>Email:</strong> {compra.clienteemail}
            </Typography>
          </CardContent>
        </Card>

        {/* Empregado */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Empregado
            </Typography>
            <Typography>
              <strong>Nome:</strong> {compra.empregadonome}
            </Typography>
            <Typography>
              <PhoneIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
              <strong>Telemóvel:</strong> {compra.empregadotelemovel}
            </Typography>
            <Typography>
              <EmailIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
              <strong>Email:</strong> {compra.empregadoemail}
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default DetalhesCompra;
