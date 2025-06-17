import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Card, CardContent, CircularProgress, Grid, Divider, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Sidebar from "../Components/SideBarDashboard";
import Footer from "../Components/Footer";

const DetalhesVendaPage = () => {
  const { numerovenda } = useParams();
  const [venda, setVenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalhesVenda = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_URL_HOST+`/vendaslista/${numerovenda}`);
        const data = await response.json();
        setVenda(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da venda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhesVenda();
  }, [numerovenda]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!venda) {
    return (
      <Container>
        <Typography variant="h6" color="error" mt={4} align="center">
          Venda não encontrada.
        </Typography>
      </Container>
    );
  }

  const totalCompra = venda.equipamentos.reduce(
  (acc, eq) => acc + eq.precounitario * eq.quantidade,
  0
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8"}}>
      <Sidebar />
      <Container sx={{ flex: 1, padding: "30px", maxWidth: "900px" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
          Detalhes da Venda 
        </Typography>

        {/* Informações da Venda */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Informações da Venda #{venda.numerovenda}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Data:</strong> {new Date(venda.datavenda).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ marginTop: "10px" }}>
                    <strong>Total da Compra:</strong> {totalCompra.toFixed(2)}€
                </Typography>
            </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography><strong>Custo de Transporte:</strong> {venda.custotransporte.toFixed(2)} €</Typography>
                </Grid>


              <Grid item xs={12} sm={6}>
                <Typography>
                    <strong>Método de Pagamento:</strong>{" "}
                    <img
                        src={
                        venda.tipo?.toLowerCase() === "mbway"
                            ? "/images/mbway.png"
                            : "/images/multibanco.png"
                        }
                        alt={venda.tipo}
                        style={{
                        height: venda.tipo?.toLowerCase() === "mbway" ? "30px" : "50px",
                        verticalAlign: "middle",
                        marginLeft: "8px",
                        }}
                    />
                    </Typography>
              </Grid>
              
            </Grid>
          </CardContent>
        </Card>


        {/* Cliente */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Cliente</Typography>
            <Typography><strong>Nome:</strong> {venda.clientenome}</Typography>
            <Typography>
              <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Telemóvel:</strong> {venda.clientetelemovel}
            </Typography>
            <Typography>
              <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Email:</strong> {venda.clienteemail}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Morada:</strong> {venda.clienterua}, {venda.clientelocalidade}
            </Typography>
          </CardContent>
        </Card>


        {/* Equipamentos */}
        <Card>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Equipamentos Vendidos
                </Typography>

                <Grid container spacing={2}>
                {venda.equipamentos.map((equipamento, index) => (
                    <Grid item xs={12} sm={6} key={equipamento.id}>
                    <Box
                        sx={{
                        display: "flex",
                        gap: 2,
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: 2,
                        height: "100%",
                        backgroundColor: "#fafafa",
                        }}
                    >
                        {/* Imagem */}
                        <Box sx={{ flex: "0 0 40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                            src={equipamento.imagemurl}
                            alt={`${equipamento.marca} ${equipamento.modelo}`}
                            style={{
                            maxWidth: "100%",
                            maxHeight: "150px",
                            borderRadius: "8px",
                            }}
                        />
                        </Box>

                        {/* Informações */}
                        <Box sx={{ flex: 1 }}>
                        <Typography><strong>Marca:</strong> {equipamento.marca}</Typography>
                        <Typography><strong>Modelo:</strong> {equipamento.modelo}</Typography>
                        <Typography>
                            <strong>Valor (€):</strong> {(equipamento.precounitario * equipamento.quantidade).toFixed(2)}
                        </Typography>
                        </Box>
                    </Box>
                    </Grid>
                ))}
                </Grid>
            </CardContent>
            </Card>



        <Button
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": { backgroundColor: "#333" },
            borderRadius: "8px",
            paddingX: 3,
            paddingY: 1,
            marginTop: "20px",
          }}
          onClick={() => navigate("/equipamentosVendidos")}
        >
          Voltar
        </Button>
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
  );
};

export default DetalhesVendaPage;



