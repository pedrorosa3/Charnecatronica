import React, { useState, useRef, useEffect } from "react";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  TextField, Button, Alert, Grid, Paper, Divider
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import StripePayment from "../Components/StripePayment";
import { useCarrinho } from "../Context/CarrinhoContext";
import { useAuth0 } from "@auth0/auth0-react";

const stripePromise = loadStripe("pk_test_51RKNAQLGKEXi0N5ltaZh7UDV9h5BGOCUrFQ9lzbWbbu77Amax7lgJ49Pw2ZM3dgSd2pxkuErF9fTB295ExHhKvtI00UR4JHQBj");

const CheckoutPagamento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripeRef = useRef();
  const { limparCarrinho } = useCarrinho();
  const { user } = useAuth0();

  const total = location.state?.total || 0;
  const carrinho = location.state?.carrinho || [];

  const [formData, setFormData] = useState({
    nif: "",
    nome: "",
    rua: "",
    numero: "",
    codigoPostal: "",
    cidade: "",
    telefone: "",
  });

  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [numeroMbway, setNumeroMbway] = useState("");
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nome: user?.name || "",
      }));
    }
  }, [user]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    const camposObrigatorios = [
      formData.nif,
      formData.nome,
      formData.rua,
      formData.numero,
      formData.codigoPostal,
      formData.cidade,
      formData.telefone,
      metodoPagamento,
    ];

    if (metodoPagamento === "mbway" && !numeroMbway.match(/^9[0-9]{8}$/)) {
      return false;
    }

    return camposObrigatorios.every((campo) => campo && campo.trim() !== "");
  };

  const handleFinalizarCompra = async () => {
    if (!isFormValid()) {
      setAlerta({ tipo: "error", texto: "Por favor, preencha todos os campos corretamente." });
      return;
    }

    try {
      // Envia a morada
      const responseMorada = await fetch("http://localhost:9000/morada", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rua: formData.rua,
          numero: formData.numero,
          codigoPostal: formData.codigoPostal,
          cidade: formData.cidade,
        }),
      });

      if (!responseMorada.ok) throw new Error("Erro ao enviar dados da morada.");
      const dataMorada = await responseMorada.json();
      const moradaId = dataMorada.id || dataMorada.moradaId;

      // Envia os dados da pessoa
      const responsePessoa = await fetch("http://localhost:9000/pessoa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nif: formData.nif,
          nome: formData.nome,
          telefone: formData.telefone,
          email: user?.email,
          moradaId,
        }),
      });

      if (!responsePessoa.ok) throw new Error("Erro ao enviar dados da pessoa.");
      const dataPessoa = await responsePessoa.json();
      console.log("👤 Pessoa criada:", dataPessoa);
      const clienteId = dataPessoa.clienteId;

      let clientSecret = null;

      // NOVO: evitar chamada para MBWay ao backend create-payment-intent
      if (metodoPagamento !== "mbway") {
        const paymentIntentResponse = await fetch("http://localhost:9000/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            metodoPagamento,
            numeroMbway: metodoPagamento === "mbway" ? numeroMbway : null,
          }),
        });

        if (!paymentIntentResponse.ok) throw new Error("Erro ao criar pagamento.");
        const paymentData = await paymentIntentResponse.json();
        clientSecret = paymentData.clientSecret;
      }

      // Processa pagamento com Stripe apenas se for cartão
      if (metodoPagamento === "cartao") {
        const sucesso = await stripeRef.current.handleStripePayment(clientSecret);
        if (!sucesso) {
          setAlerta({ tipo: "error", texto: "Erro no pagamento com Cartão." });
          return;
        }
      }

      // Regista a venda no backend (independente do método)
      const responseVenda = await fetch("http://localhost:9000/venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: metodoPagamento,
          custoTransporte: 0,
          lojaNipc: null,
          empregadoId: null,
          clienteId,
          carrinho: carrinho.map(item => ({
            id: item.id,
            quantidade: item.quantidade,
            preco: item.preco,
          })),
        }),
      });

      if (!responseVenda.ok) throw new Error("Erro ao registar venda.");
      const dataVenda = await responseVenda.json();

      if (!dataVenda.success) {
        setAlerta({ tipo: "error", texto: "Erro ao salvar a venda." });
        return;
      }

      mostrarAlertaSucessoERedirecionar("Compra realizada com sucesso!");

    } catch (error) {
      console.error(error);
      setAlerta({ tipo: "error", texto: "Ocorreu um erro. Tente novamente." });
    }
  };

  const mostrarAlertaSucessoERedirecionar = (texto) => {
    setAlerta({ tipo: "success", texto });
    limparCarrinho();
    setTimeout(() => navigate("/"), 2500);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />

      <Box flex="1" p={4} sx={{ paddingTop: "120px" }}>
        <Grid container spacing={4}>
          {/* Formulário */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Morada de Expedição
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="NIF"
                    fullWidth
                    required
                    value={formData.nif}
                    onChange={(e) => {
                      let valor = e.target.value.replace(/\D/g, "").slice(0, 9);
                      handleFormChange("nif", valor);
                    }}
                    inputProps={{ inputMode: "numeric", maxLength: 9 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nome"
                    fullWidth
                    required
                    value={formData.nome}
                    onChange={(e) => handleFormChange("nome", e.target.value)}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    label="Rua"
                    fullWidth
                    required
                    value={formData.rua}
                    onChange={(e) => handleFormChange("rua", e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Número / Andar"
                    fullWidth
                    required
                    value={formData.numero}
                    onChange={(e) => handleFormChange("numero", e.target.value)}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Código Postal"
                    fullWidth
                    required
                    value={formData.codigoPostal}
                    onChange={(e) => handleFormChange("codigoPostal", e.target.value)}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Cidade"
                    fullWidth
                    required
                    value={formData.cidade}
                    onChange={(e) => handleFormChange("cidade", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Telemóvel"
                    fullWidth
                    required
                    value={formData.telefone}
                    onChange={(e) => {
                      let valor = e.target.value.replace(/\D/g, "").slice(0, 9);
                      if (valor && valor[0] !== "9") valor = "9" + valor.slice(1);
                      handleFormChange("telefone", valor);
                    }}
                    inputProps={{ inputMode: "numeric", maxLength: 9 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <FormControl fullWidth required>
                <InputLabel>Método de Pagamento</InputLabel>
                <Select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                  label="Método de Pagamento"
                >
                  <MenuItem value="cartao">Cartão de Crédito</MenuItem>
                  <MenuItem value="mbway">MBWay</MenuItem>
                </Select>
              </FormControl>

              {metodoPagamento === "mbway" && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Número MBWay"
                    value={numeroMbway}
                    onChange={(e) => {
                      let valor = e.target.value.replace(/\D/g, "").slice(0, 9);
                      if (valor && valor[0] !== "9") valor = "9" + valor.slice(1);
                      setNumeroMbway(valor);
                    }}
                    inputProps={{ inputMode: "numeric", maxLength: 9 }}
                    required
                  />
                </Box>
              )}

              {metodoPagamento === "cartao" && (
                <Box sx={{ mt: 3 }}>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      ref={stripeRef}
                      amount={total}
                      onSuccess={() => mostrarAlertaSucessoERedirecionar("Pagamento realizado com Cartão!")}
                    />
                  </Elements>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleFinalizarCompra}
                sx={{ mt: 3 }}
                disabled={!isFormValid()}
              >
                Finalizar Compra
              </Button>

              {alerta && (
                <Alert severity={alerta.tipo} sx={{ mt: 2 }}>
                  {alerta.texto}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Resumo da Encomenda */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                A Minha Encomenda
              </Typography>

              {carrinho.length > 0 ? (
                carrinho.map((produto, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <img
                      src={produto.imagem || "/placeholder.png"}
                      alt={produto.nome}
                      style={{ width: 80, height: 80, marginRight: 16, objectFit: "contain" }}
                    />
                    <Box flex="1">
                      <Typography fontWeight="bold">
                        {produto.marca} {produto.modelo || produto.nome}
                      </Typography>
                      <Typography variant="body2">Quantidade: {produto.quantidade}</Typography>
                    </Box>
                    <Typography fontWeight="bold">
                      {(produto.preco * produto.quantidade).toFixed(2)} €
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>Nenhum produto no carrinho.</Typography>
              )}

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" textAlign="right">
                Total: {total.toFixed(2)} €
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default CheckoutPagamento;









