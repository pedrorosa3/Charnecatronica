import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const ReparacoesEmpregado = () => {
  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [formData, setFormData] = useState({
    clienteId: "",
    codBarras: "",
    lojaNipc: "",
    descNaoFunciona: "",
    dataRececaoEquipamento: new Date().toISOString().split("T")[0],
    dataEntregaAoCliente: new Date().toISOString().split("T")[0],
    empregadoId: "",
    orcamentoReparacao: 0,
    numPedidoOrcamento: 0,
    compraId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClientes, resFichas, resLojas] = await Promise.all([
          fetch("http://localhost:9000/clientes"),
          fetch("http://localhost:9000/fichas"),
          fetch("http://localhost:9000/lojas"),
        ]);

        setClientes(await resClientes.json());
        setEquipamentos(await resFichas.json());
        setLojas(await resLojas.json());

        if (formData.lojaNipc) {
          const resEmpregados = await fetch(
            `http://localhost:9000/lojas/${formData.lojaNipc}/empregados`
          );
          setEmpregados(await resEmpregados.json());
        } else {
          setEmpregados([]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData.lojaNipc]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converter apenas os campos que devem ser numéricos
    const dataToSubmit = {
      ...formData,
      clienteId: Number(formData.clienteId),
      lojaNipc: Number(formData.lojaNipc),
      empregadoId: Number(formData.empregadoId),
    };

    try {
      const res = await fetch("http://localhost:9000/reparacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (!res.ok) throw new Error("Erro na submissão");

      const data = await res.json();
      setSnackbarMessage("Reparação registada com sucesso!");
      setSnackbarOpen(true);
      console.log("Resposta:", data);
    } catch (error) {
      console.error("Erro ao submeter reparação:", error);
      setSnackbarMessage("Erro ao registar reparação.");
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
      }}
    >
      <Header />
      <Box sx={{ flex: 1, padding: "20px", paddingTop: "100px", mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Registo de reparação
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Cliente"
                name="clienteId"
                value={formData.clienteId ?? ""}
                onChange={handleChange}
                required
              >
                {clientes.map((c) => (
                  <MenuItem key={c.clienteid} value={c.clienteid}>
                    {c.nome || `Cliente ${c.clienteid}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Ficha de Equipamento"
                name="codBarras"
                value={formData.codBarras ?? ""}
                onChange={handleChange}
                required
              >
                {equipamentos.map((f) => (
                  <MenuItem key={f.codbarras} value={f.codbarras}>
                    {f.marca} {f.modelo}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Loja"
                name="lojaNipc"
                value={formData.lojaNipc}
                onChange={handleChange}
                required
              >
                {lojas.map((loja) => (
                  <MenuItem key={loja.nipc} value={loja.nipc.toString()}>
                    {loja.nome} - {loja.nipc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Empregado que recebeu"
                name="empregadoId"
                value={formData.empregadoId ?? ""}
                onChange={handleChange}
                required
                disabled={!formData.lojaNipc}
              >
                {!formData.lojaNipc ? (
                  <MenuItem value="">Indique a loja</MenuItem>
                ) : empregados.length === 0 ? (
                  <MenuItem value="">
                    Nenhum empregado encontrado para esta loja
                  </MenuItem>
                ) : (
                  empregados.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.nome}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição da avaria:"
                name="descNaoFunciona"
                value={formData.descNaoFunciona}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Data de receção do equipamento:"
                name="dataRececaoEquipamento"
                type="date"
                fullWidth
                value={formData.dataRececaoEquipamento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "50px",
                  fontWeight: "bold",
                  padding: "10px",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Submeter Reparação
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ReparacoesEmpregado;
