import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "../Components/SideBarDashboard";
import Footer from "../Components/Footer";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";

const DiagnosticoReparacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estadoEquipamento, setEstadoEquipamento] = useState("");
  const [pecas, setPecas] = useState([{ nome: "", preco: "" }]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Carrega diagnóstico anterior (se existir)
  useEffect(() => {
    const fetchDiagnostico = async () => {
      try {
        const response = await fetch(`http://localhost:9000/reparacoes/${id}`);
        const data = await response.json();

        if (data.estadoDiagnostico) {
          setEstadoEquipamento(data.estadoDiagnostico);
        }

        if (
          Array.isArray(data.pecasSubstituir) &&
          data.pecasSubstituir.length > 0
        ) {
          setPecas(
            data.pecasSubstituir.map((peca) => ({
              nome: peca.nome,
              preco: peca.preco.toString(),
            }))
          );
        }
      } catch (error) {
        console.error("Erro ao carregar diagnóstico:", error);
      }
    };

    fetchDiagnostico();
  }, [id]);

  const handleChangePeca = (index, field, value) => {
    const novasPecas = [...pecas];
    novasPecas[index][field] = value;
    setPecas(novasPecas);
  };

  const handleAdicionarPeca = () => {
    setPecas([...pecas, { nome: "", preco: "" }]);
  };

  const handleRemoverPeca = (index) => {
    const novasPecas = pecas.filter((_, i) => i !== index);
    setPecas(novasPecas);
  };

  const calcularTotal = () => {
    return pecas
      .reduce((total, peca) => {
        const preco = parseFloat(peca.preco);
        return total + (isNaN(preco) ? 0 : preco);
      }, 0)
      .toFixed(2);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/pecasDiagnostico/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estadoEquipamento,
            pecas: pecas.filter((p) => p.nome && p.preco),
          }),
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Diagnóstico submetido com sucesso!",
          severity: "success",
        });
        setTimeout(() => navigate(`/reparacoes/${id}`), 2000);
      } else {
        throw new Error("Erro ao submeter diagnóstico.");
      }
    } catch (error) {
      console.error("Erro ao submeter diagnóstico:", error);
      setSnackbar({
        open: true,
        message: "Erro ao submeter diagnóstico.",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
      }}
    >
      <Sidebar />
      <Container sx={{ flex: 1, padding: "30px", mt: 12, maxWidth: "800px" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Diagnóstico da Reparação
        </Typography>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Estado do equipamento:
                </Typography>
                <TextField
                  label="Descrição do estado do equipamento"
                  multiline
                  rows={4}
                  fullWidth
                  value={estadoEquipamento}
                  onChange={(e) => setEstadoEquipamento(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Peças a substituir
                </Typography>
                {pecas.map((peca, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={index}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Grid item xs={5}>
                      <TextField
                        label="Nome da Peça"
                        fullWidth
                        value={peca.nome}
                        onChange={(e) =>
                          handleChangePeca(index, "nome", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        label="Preço (€)"
                        fullWidth
                        type="number"
                        inputProps={{ step: "0.01", min: "0" }}
                        value={peca.preco}
                        onChange={(e) =>
                          handleChangePeca(index, "preco", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => handleRemoverPeca(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button startIcon={<AddIcon />} onClick={handleAdicionarPeca}>
                  Adicionar Peça
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  <strong>Valor total:</strong> {calcularTotal()} €
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#000",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#eee",
                      borderColor: "#000",
                    },
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                  }}
                  onClick={() => navigate(`/reparacoes/${id}`)}
                >
                  Voltar
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#333" },
                    borderRadius: "8px",
                    px: 4,
                    py: 1,
                  }}
                  onClick={handleSubmit}
                >
                  Submeter Diagnóstico
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
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

export default DiagnosticoReparacao;
