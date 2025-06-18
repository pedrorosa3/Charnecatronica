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
import Sidebar from "../Components/SideBarDashboard";
import Footer from "../Components/Footer";

const ReparacoesEmpregado = () => {
  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  const entregaPrevista = new Date(today);
  entregaPrevista.setDate(entregaPrevista.getDate() + 14);

  const [formData, setFormData] = useState({
    clienteId: "",
    codBarras: "",
    lojaNipc: "",
    descNaoFunciona: "",
    dataRececaoEquipamento: formatDate(today),
    dataEntregaAoCliente: formatDate(entregaPrevista),
    empregadoId: "",
    orcamentoReparacao: 0,
    numPedidoOrcamento: 0,
    compraId: null,
    estado: "Por orçamentar",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClientes, resFichas, resLojas] = await Promise.all([
          fetch(process.env.REACT_APP_URL_HOST+"/clientes"),
          fetch(process.env.REACT_APP_URL_HOST+"/fichas"),
          fetch(process.env.REACT_APP_URL_HOST+"/lojas"),
        ]);

        setClientes(await resClientes.json());
        setEquipamentos(await resFichas.json());
        setLojas(await resLojas.json());

        if (formData.lojaNipc) {
          const resEmpregados = await fetch(
            process.env.REACT_APP_URL_HOST+`/lojas/${formData.lojaNipc}/empregados`
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

  useEffect(() => {
    if (formData.dataRececaoEquipamento) {
      const data = new Date(formData.dataRececaoEquipamento);
      data.setDate(data.getDate() + 14);
      setFormData((prev) => ({
        ...prev,
        dataEntregaAoCliente: formatDate(data),
      }));
    }
  }, [formData.dataRececaoEquipamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      clienteId: Number(formData.clienteId),
      lojaNipc: Number(formData.lojaNipc),
      empregadoId: Number(formData.empregadoId),
    };

    try {
      const res = await fetch(process.env.REACT_APP_URL_HOST+"/reparacoes", {
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
    <>
      {/* Sidebar fixa */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "250px",
          height: "calc(100vh - 60px)", // altura da viewport menos footer
          bgcolor: "#f0f0f0",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </Box>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          marginLeft: "250px", // deixa espaço para a sidebar
          padding: 4,
          minHeight: "100vh",
          paddingBottom: "60px", // espaço para o footer
          bgcolor: "#fff",
        }}
      >
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
                  <MenuItem value="">Nenhum empregado encontrado para esta loja</MenuItem>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <TextField
                label="Data de entrega prevista:"
                name="dataEntregaAoCliente"
                type="date"
                fullWidth
                value={formData.dataEntregaAoCliente}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: "#000",
                      color: "#fff",
                      borderRadius: "50px",
                      fontWeight: "bold",
                      padding: "10px",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                    onClick={() => (window.location.href = "/listaReparacoes")}
                  >
                    Lista de Reparações
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
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
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Footer fixo no fundo */}
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

      {/* Snackbar */}
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
    </>
  );
};

export default ReparacoesEmpregado;
