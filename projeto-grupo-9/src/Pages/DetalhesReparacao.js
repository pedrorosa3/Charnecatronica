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
  Button,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const DetalhesReparacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reparacao, setReparacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReparacao = async () => {
      try {
        const response = await fetch(`http://localhost:9000/reparacoes/${id}`);
        const data = await response.json();
        setReparacao(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da reparação:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReparacao();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reparacao) {
    return (
      <Container>
        <Typography variant="h6" color="error" mt={4} align="center">
          Reparação não encontrada.
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
          Detalhes da Reparação
        </Typography>

        {/* Informação da Reparação */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Dados da Reparação
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>ID:</strong> {reparacao.id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Estado:</strong> {reparacao.estado}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Descrição da avaria:</strong>{" "}
                  {reparacao.descnaofunciona}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Receção:</strong>{" "}
                  {new Date(
                    reparacao.datarececaoequipamento
                  ).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Entrega prevista:</strong>{" "}
                  {new Date(
                    reparacao.dataentregaaocliente
                  ).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Orçamento:</strong>{" "}
                  {reparacao.orcamentoreparacao?.toFixed(2)} €
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Nº Pedido Orçamento:</strong>{" "}
                  {reparacao.numpedidoorcamento}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Produto */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Produto
            </Typography>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {reparacao.imagemurl && (
                  <img
                    src={reparacao.imagemurl}
                    alt={`${reparacao.marca} ${reparacao.modelo}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "250px",
                      borderRadius: "10px",
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography sx={{ mb: 1 }}>
                  <strong>Marca:</strong> {reparacao.marca}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Modelo:</strong> {reparacao.modelo}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <strong>Tipo:</strong> {reparacao.tipo}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  <strong>Diagnóstico:</strong>{" "}
                  {reparacao.estadoDiagnostico || "Ainda não diagnosticado."}
                </Typography>

                {reparacao.pecasSubstituir?.length > 0 && (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Peças a Substituir:
                      </Typography>
                      <ul style={{ marginLeft: "16px" }}>
                        {reparacao.pecasSubstituir.map((peca, index) => (
                          <li key={index}>
                            {peca.nome} — {parseFloat(peca.preco).toFixed(2)} €
                          </li>
                        ))}
                      </ul>
                    </Box>
                    <Typography
                      sx={{
                        mt: 2,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      Valor das peças:{" "}
                      {reparacao.pecasSubstituir
                        .reduce((acc, p) => acc + parseFloat(p.preco || 0), 0)
                        .toFixed(2)}{" "}
                      €
                    </Typography>
                  </>
                )}
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
              <strong>Nome:</strong> {reparacao.lojanome}
            </Typography>
            <Typography>
              <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Telefone:</strong> {reparacao.lojatelefone}
            </Typography>
            <Typography>
              <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Email:</strong> {reparacao.lojaemail}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Morada:</strong> {reparacao.lojarua}, Nº{" "}
              {reparacao.lojanumero}, {reparacao.lojalocalidade},{" "}
              {reparacao.lojaconcelho}, {reparacao.lojadistrito},{" "}
              {reparacao.lojacodigopostal}
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
              <strong>Nome:</strong> {reparacao.clientenome}
            </Typography>
            <Typography>
              <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Telemóvel:</strong> {reparacao.clientetelemovel}
            </Typography>
            <Typography>
              <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Email:</strong> {reparacao.clienteemail}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Morada:</strong> {reparacao.clienterua}, Nº{" "}
              {reparacao.clientenumero}, {reparacao.clientelocalidade},{" "}
              {reparacao.clienteconcelho}, {reparacao.clientedistrito},{" "}
              {reparacao.clientecodigopostal}
            </Typography>
          </CardContent>
        </Card>

        {/* Empregado */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Empregado Responsável
            </Typography>
            <Typography>
              <strong>Nome:</strong> {reparacao.empregadonome}
            </Typography>
            <Typography>
              <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Telemóvel:</strong> {reparacao.empregadotelemovel}
            </Typography>
            <Typography>
              <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              <strong>Email:</strong> {reparacao.empregadoemail}
            </Typography>
          </CardContent>
        </Card>

        {/* Botões */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": { backgroundColor: "#333" },
              borderRadius: "8px",
              px: 3,
              py: 1,
            }}
            onClick={() => navigate("/listaReparacoes")}
          >
            Voltar
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#000",
                color: "#000",
                "&:hover": { borderColor: "#333", color: "#333" },
                borderRadius: "8px",
                px: 3,
                py: 1,
              }}
              onClick={() => navigate(`/reparacoes/${reparacao.id}/editar`)}
            >
              Editar Reparação
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
                borderRadius: "8px",
                px: 3,
                py: 1,
              }}
              onClick={() =>
                navigate(`/reparacoes/${reparacao.id}/diagnostico`)
              }
            >
              Realizar Diagnóstico
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default DetalhesReparacao;
