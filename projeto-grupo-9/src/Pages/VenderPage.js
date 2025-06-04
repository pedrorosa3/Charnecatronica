import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import Footer from "../Components/Footer";
import Sidebar from "../Components/SideBarDashboard";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePayment from "../Components/StripePayment";

const stripePromise = loadStripe(
  "pk_test_51RKNAQLGKEXi0N5ltaZh7UDV9h5BGOCUrFQ9lzbWbbu77Amax7lgJ49Pw2ZM3dgSd2pxkuErF9fTB295ExHhKvtI00UR4JHQBj"
);

const VenderPage = () => {
  const [formData, setFormData] = useState({
    preco: "",
    clienteId: "",
    empregadoId: "",
    lojaNipc: "",
    estado: "",
    Cod_barras: "",
    marca: "",
    modelo: "",
    metodoPagamento: "",
  });

  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [numeroMbway, setNumeroMbway] = useState("");

  const [lojas, setLojas] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);

  // Estados para Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const stripeRef = useRef();

  // Função para mostrar o snackbar com mensagem e tipo (success, error, etc)
  

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const res = await fetch("http://localhost:9000/lojas");
        const data = await res.json();
        setLojas(data);
      } catch (err) {
        console.error("Erro ao buscar lojas:", err);
      }
    };
    fetchLojas();
  }, []);

  useEffect(() => {
    if (formData.lojaNipc) {
      const fetchEmpregados = async () => {
        try {
          const res = await fetch(
            `http://localhost:9000/lojas/${formData.lojaNipc}/empregados`
          );
          const data = await res.json();
          setEmpregados(data);
        } catch (err) {
          console.error("Erro ao buscar empregados:", err);
        }
      };
      fetchEmpregados();
    }
  }, [formData.lojaNipc]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("http://localhost:9000/clientes");
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const res = await fetch("http://localhost:9000/fichas");
        const data = await res.json();
        setEquipamentos(data);
        const marcasUnicas = [...new Set(data.map((e) => e.marca))];
        setMarcas(marcasUnicas);
      } catch (err) {
        console.error("Erro ao buscar equipamentos:", err);
      }
    };
    fetchEquipamentos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registarCompra = async () => {
    if (!formData.modelo) {
      showSnackbar("Erro: O modelo é obrigatório.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSnackbar("Compra registada com sucesso!", "success");
        setFormData({
          preco: "",
          clienteId: "",
          empregadoId: "",
          lojaNipc: "",
          estado: "",
          Cod_barras: "",
          marca: "",
          modelo: "",
          metodoPagamento: "",
        });
        setNumeroMbway("");
      } else {
        const err = await response.json();
        showSnackbar(`Erro: ${err?.error || "Erro ao registar compra."}`, "error");
      }
    } catch (err) {
      showSnackbar("Erro ao conectar-se ao servidor.", "error");
    }
  };

  const handleSubmitCompra = async () => {
    if (metodoPagamento === "mbway") {
      if (!numeroMbway.match(/^[9][0-9]{8}$/)) {
        showSnackbar("Número de telemóvel MBWay inválido.", "error");
        return;
      }
      registarCompra(); // MBWay não usa Stripe
    } else if (metodoPagamento === "multibanco") {
      try {
        const res = await fetch("http://localhost:9000/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(formData.preco),
            metodoPagamento: "cartao",
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.clientSecret) {
          showSnackbar(`Erro ao iniciar pagamento: ${data.error || "Desconhecido"}`, "error");
          return;
        }

        const sucesso = await stripeRef.current?.handleStripePayment(data.clientSecret);

        if (!sucesso) {
          showSnackbar("Pagamento falhou.", "error");
        }

        // ⚠️ NÃO chamar registarCompra() aqui — já é feito dentro do StripePayment via onSuccess
      } catch (err) {
        console.error("Erro no pagamento Stripe:", err);
        showSnackbar("Erro ao processar o pagamento.", "error");
      }
    }
  };




  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
        marginTop: "px",
      }}
    >
      <Sidebar />

      <Box sx={{ display: "flex", flex: 1, paddingTop: "20px" }}>
        <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
          <Card
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{ fontWeight: "bold" }}
              >
                Nova Compra
              </Typography>

              <form onSubmit={(e) => e.preventDefault()}>
                <Autocomplete
                  options={lojas}
                  getOptionLabel={(option) => option.nome}
                  onChange={(e, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      lojaNipc: value?.nipc || "",
                      empregadoId: "",
                    }))
                  }
                  value={
                    lojas.find((l) => l.nipc === formData.lojaNipc) || null
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Loja" required />
                  )}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={empregados}
                  getOptionLabel={(option) => option.nome}
                  onChange={(e, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      empregadoId: value?.id || "",
                    }))
                  }
                  value={
                    empregados.find((e) => e.id === formData.empregadoId) ||
                    null
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Empregado" required />
                  )}
                  disabled={!formData.lojaNipc}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={clientes}
                  getOptionLabel={(option) => option.nome}
                  onChange={(e, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      clienteId: value?.clienteid || "",
                    }))
                  }
                  value={
                    clientes.find((c) => c.clienteid === formData.clienteId) ||
                    null
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Cliente" required />
                  )}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={marcas}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) => {
                    setFormData((prev) => ({
                      ...prev,
                      marca: value || "",
                      modelo: "",
                      Cod_barras: "",
                    }));
                    const modelos = equipamentos.filter(
                      (e) => e.marca === value
                    );
                    setModelosFiltrados(modelos);
                  }}
                  value={formData.marca || null}
                  renderInput={(params) => (
                    <TextField {...params} label="Marca" required />
                  )}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={modelosFiltrados}
                  getOptionLabel={(option) => option.modelo}
                  onChange={(e, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      modelo: value?.modelo || "",
                    }))
                  }
                  value={
                    modelosFiltrados.find(
                      (m) => m.modelo === formData.modelo
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Modelo" required />
                  )}
                  disabled={!formData.marca}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={[
                    "Novo",
                    "Semi-novo",
                    "Usado",
                    "Muito usado",
                  ]}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) =>
                    setFormData((prev) => ({ ...prev, estado: value || "" }))
                  }
                  value={formData.estado || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Estado do Equipamento"
                      required
                    />
                  )}
                  sx={{ mt: 2 }}
                />

                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="metodo-pagamento-label">
                    Método de Pagamento
                  </InputLabel>
                  <Select
                    labelId="metodo-pagamento-label"
                    value={metodoPagamento}
                    onChange={(e) => {
                      setMetodoPagamento(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        metodoPagamento: e.target.value,
                      }));
                    }}
                    label="Método de Pagamento"
                  >
                    <MenuItem value="multibanco">Multibanco</MenuItem>
                    <MenuItem value="mbway">MBWay</MenuItem>
                  </Select>
                </FormControl>

                {metodoPagamento === "mbway" && (
                  <TextField
                    fullWidth
                    label="Número MB WAY"
                    value={numeroMbway}
                    onChange={(e) => {
                      const apenasNumeros = e.target.value.replace(/\D/g, "");
                      setNumeroMbway(apenasNumeros);
                    }}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: 9,
                    }}
                    margin="normal"
                    required
                  />
                )}

                {metodoPagamento === "multibanco" && (
                  <Box sx={{ mt: 2 }}>
                    <Elements stripe={stripePromise}>
                      <StripePayment
                        ref={stripeRef}
                        amount={formData.preco}
                        onSuccess={registarCompra}
                      />
                    </Elements>
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{
                    backgroundColor: "#F5F5F5",
                    borderRadius: "5px",
                    mt: 2,
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 3,
                    backgroundColor: "black",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                  onClick={handleSubmitCompra}
                >
                  Submeter Compra
                </Button>
              </form>
            </CardContent>
          </Card>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>

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

export default VenderPage;
