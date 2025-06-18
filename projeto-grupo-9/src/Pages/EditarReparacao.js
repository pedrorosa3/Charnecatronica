import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Components/SideBarDashboard";
import Footer from "../Components/Footer";

const EditarReparacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resReparacao = await fetch(
          process.env.REACT_APP_URL_HOST+`/reparacoes/${id}`
        );
        const reparacao = await resReparacao.json();

        const [resClientes, resFichas, resLojas] = await Promise.all([
          fetch(process.env.REACT_APP_URL_HOST+"/clientes"),
          fetch(process.env.REACT_APP_URL_HOST+"/fichas"),
          fetch(process.env.REACT_APP_URL_HOST+"/lojas"),
        ]);

        const [clientesData, fichasData, lojasData] = await Promise.all([
          resClientes.json(),
          resFichas.json(),
          resLojas.json(),
        ]);

        const resEmpregados = await fetch(
          process.env.REACT_APP_URL_HOST+`/lojas/${reparacao.lojanipc}/empregados`
        );
        const empregadosData = await resEmpregados.json();

        setFormData({
          clienteId: reparacao.clienteid,
          codBarras: reparacao.codbarras,
          lojaNipc: reparacao.lojanipc,
          descNaoFunciona: reparacao.descnaofunciona,
          dataRececaoEquipamento: formatDate(reparacao.datarececaoequipamento),
          dataEntregaAoCliente: formatDate(reparacao.dataentregaaocliente),
          empregadoId: reparacao.empregadoid,
          orcamentoReparacao: reparacao.orcamentoreparacao,
          numPedidoOrcamento: reparacao.numpedidoorcamento,
          compraId: reparacao.compraid,
          estado: reparacao.estado,
        });

        setClientes(clientesData);
        setEquipamentos(fichasData);
        setLojas(lojasData);
        setEmpregados(empregadosData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(process.env.REACT_APP_URL_HOST+`/reparacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar");

      setSnackbar({
        open: true,
        message: "Reparação atualizada com sucesso!",
        severity: "success",
      });
      setTimeout(() => navigate(`/reparacoes/${id}`), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Erro ao atualizar reparação.",
        severity: "error",
      });
    }
  };

  if (loading || !formData) {
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
      <Sidebar />
      <Container sx={{ paddingTop: "100px", mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Editar Reparação
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Cliente"
                fullWidth
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
              >
                {clientes.map((c) => (
                  <MenuItem key={c.clienteid} value={c.clienteid}>
                    {c.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Ficha de Equipamento"
                fullWidth
                name="codBarras"
                value={formData.codBarras}
                onChange={handleChange}
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
                label="Loja"
                fullWidth
                name="lojaNipc"
                value={formData.lojaNipc}
                onChange={handleChange}
              >
                {lojas.map((loja) => (
                  <MenuItem key={loja.nipc} value={loja.nipc}>
                    {loja.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Empregado"
                fullWidth
                name="empregadoId"
                value={formData.empregadoId}
                onChange={handleChange}
              >
                {empregados.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Estado"
                fullWidth
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                {[
                  "Por orçamentar",
                  "Orçamentado",
                  "A aguardar confirmação do cliente",
                  "Reparado",
                ].map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor do Orçamento (€)"
                type="number"
                inputProps={{ step: "0.01", min: "0" }}
                fullWidth
                name="orcamentoReparacao"
                value={formData.orcamentoReparacao}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição da Avaria"
                multiline
                rows={4}
                fullWidth
                name="descNaoFunciona"
                value={formData.descNaoFunciona}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Data Receção"
                type="date"
                fullWidth
                name="dataRececaoEquipamento"
                value={formData.dataRececaoEquipamento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Data Entrega Prevista"
                type="date"
                fullWidth
                name="dataEntregaAoCliente"
                value={formData.dataEntregaAoCliente}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      backgroundColor: "#000",
                      color: "#fff",
                      borderRadius: "50px",
                      padding: "10px",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                    onClick={() => navigate(`/reparacoes/${id}`)}
                  >
                    Voltar
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
                      padding: "10px",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    Atualizar Reparação
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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

export default EditarReparacao;
