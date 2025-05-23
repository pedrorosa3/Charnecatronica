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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
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

  const [openVendaModal, setOpenVendaModal] = useState(false);
  const [precoVenda, setPrecoVenda] = useState("");
  const [erroPreco, setErroPreco] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await fetch(`http://localhost:9000/compraslista/${id}`);
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

  const handleConfirmarVenda = async () => {
  const preco = parseFloat(precoVenda);

  if (isNaN(preco) || preco <= 0 || !/^\d+(\.\d{1,2})?$/.test(precoVenda)) {
    setErroPreco("Insira um valor válido com até duas casas decimais.");
    return;
  }

  const equipamentoParaVender = {
    codBarras: compra.equipamentocodbarras,
    marca: compra.equipamentomarca,
    modelo: compra.equipamentomodelo,
    tipo: compra.equipamentotipo,
    precoBase: compra.preco,
    anoLancamento: compra.equipamentoanolancamento,
    estado: compra.estado,
    preco: preco,
    lojaNipc: compra.lojanipc,
    imagemurl: compra.equipamentoimagemurl,
    compraId: compra.id, // <-- AQUI adicionamos o ID da compra
  };

  try {
    const response = await fetch("http://localhost:9000/equipamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipamentoParaVender),
    });

    if (response.ok) {
      showSnackbar("Equipamento vendido com sucesso!", "success");
      setOpenVendaModal(false);
    } else {
      showSnackbar("Erro ao vender o equipamento.", "error");
    }
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    showSnackbar("Erro ao conectar com o servidor.", "error");
  }
};


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
          Detalhes da compra
        </Typography>

        {/* Informações Gerais */}
        <Card sx={{ mb: 3, borderRadius: "8px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Informações Gerais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Data:</strong> {new Date(compra.data).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Preço de Compra:</strong> {compra.preco.toFixed(2)}€
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Estado do Equipamento:</strong> {compra.estado}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Método de Pagamento:</strong>{" "}
                  <img
                    src={
                      compra.metodopagamento?.toLowerCase() === "mbway"
                        ? "/images/mbway.png"
                        : "/images/multibanco.png"
                    }
                    alt={compra.metodopagamento}
                    style={{
                      height: compra.metodopagamento?.toLowerCase() === "mbway" ? "30px" : "50px",
                      verticalAlign: "middle",
                      marginLeft: "8px",
                    }}
                  />
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
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
                  <strong>Ano de Lançamento:</strong> {compra.equipamentoanolancamento}
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
              <LocationOnIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
              <strong>Morada:</strong> {compra.lojarua}, Nº {compra.lojanumero},{" "}
              {compra.lojalocalidade}, {compra.lojaconcelho}, {compra.lojadistrito},{" "}
              {compra.lojacodigopostal}
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
            <Typography>
              <LocationOnIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
              <strong>Morada:</strong> {compra.clienterua}, {compra.clientelocalidade}
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

        {/* Botões Ações */}
        <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
          <Grid item>
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
              onClick={() => navigate("/equipamentosComprados")}
            >
              Voltar
            </Button>
          </Grid>
          <Grid item>
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
              onClick={() => setOpenVendaModal(true)}
              disabled={compra.estadocompra?.toLowerCase() !== "por vender"}
            >
              Vender Equipamento
            </Button>

          </Grid>
        </Grid>

        {/* Modal Venda */}
        <Dialog open={openVendaModal} onClose={() => setOpenVendaModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Vender Equipamento</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              <strong>Preço Base:</strong> {compra.preco.toFixed(2)}€
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Preço de Venda (€)"
              type="text"
              fullWidth
              variant="outlined"
              value={precoVenda}
              onChange={(e) => {
                const valor = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(valor)) {
                  setPrecoVenda(valor);
                  setErroPreco("");
                }
              }}
              inputProps={{ inputMode: "decimal", pattern: "[0-9]*\\.?[0-9]{0,2}" }}
              error={!!erroPreco}
              helperText={erroPreco}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              variant="contained"
              onClick={() => setOpenVendaModal(false)}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
                borderRadius: "8px",
                px: 3,
                py: 1,
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmarVenda}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
                borderRadius: "8px",
                px: 3,
                py: 1,
              }}
            >
              Confirmar Venda
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Alert */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </Box>
  );
};

export default DetalhesCompra;



