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

const stripePromise = loadStripe("pk_test_..."); // substitua pela sua chave real

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
  
    // Dados de morada para enviar para o backend
    const dadosMorada = {
      rua: formData.rua,
      numero: formData.numero,
      codigoPostal: formData.codigoPostal,
      cidade: formData.cidade,
    };
  
    // Dados da pessoa (nif, nome, telefone, email)
    const dadosPessoa = {
      nif: formData.nif,
      nome: formData.nome,
      telefone: formData.telefone,
      email: user?.email, // Obtendo o email do Auth0
      
    };
  
    try {
      // Enviar os dados da morada para o backend
      const responseMorada = await fetch("http://localhost:9000/morada", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosMorada),
      });
  
      if (!responseMorada.ok) {
        const errorMessage = await responseMorada.text();
        throw new Error(`Erro ao enviar dados da morada: ${errorMessage}`);
      }
  
      const dataMorada = await responseMorada.json();
      console.log("Resposta da morada:", dataMorada); // Verifique se é o esperado

      console.log("Dados da pessoa antes de enviar:", dadosPessoa);
  
      if (dataMorada.success) {
        // Agora, enviando os dados da pessoa para o backend
        const responsePessoa = await fetch("http://localhost:9000/pessoa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosPessoa),
        });
  
        if (!responsePessoa.ok) {
          const errorMessage = await responsePessoa.text();
          throw new Error(`Erro ao enviar dados da pessoa: ${errorMessage}`);
        }
  
        const dataPessoa = await responsePessoa.json();
        console.log("Resposta da pessoa:", dataPessoa); // Verifique se é o esperado
        if (dataPessoa.success) {
          // Se tudo estiver bem, finalizar a compra
          if (metodoPagamento === "mbway") {
            mostrarAlertaSucessoERedirecionar("Compra realizada com MBWay!");
          }
  
          if (metodoPagamento === "multibanco" && stripeRef.current) {
            await stripeRef.current.handleStripePayment();
            mostrarAlertaSucessoERedirecionar("Pagamento realizado com Multibanco!");
          }
        } else {
          setAlerta({ tipo: "error", texto: "Erro ao salvar dados da pessoa." });
        }
      } else {
        setAlerta({ tipo: "error", texto: "Erro ao salvar morada." });
      }
    } catch (error) {
      console.error("Erro capturado:", error);
      setAlerta({ tipo: "error", texto: "Houve um erro. Tente novamente mais tarde." });
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
                    onChange={(e) => handleFormChange("nif", e.target.value)}
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
                      let valor = e.target.value.replace(/\D/g, "").slice(0, 9); // Remove não-números e limita a 9 caracteres
                      if (valor && valor[0] !== "9") valor = "9" + valor.slice(1); // Garante que comece com 9
                      handleFormChange("telefone", valor);
                    }}
                    inputProps={{ inputMode: "numeric", maxLength: 9 }}
                  />
                </Grid>

              </Grid>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Método de Pagamento</InputLabel>
                    <Select
                      value={metodoPagamento}
                      onChange={(e) => setMetodoPagamento(e.target.value)}
                      label="Método de Pagamento"
                    >
                      <MenuItem value="multibanco">Multibanco</MenuItem>
                      <MenuItem value="mbway">MBWay</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {metodoPagamento === "mbway" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Número MBWay"
                      value={numeroMbway}
                      onChange={(e) => setNumeroMbway(e.target.value.replace(/\D/g, "").slice(0, 9))}
                      inputProps={{ inputMode: "numeric", maxLength: 9 }}
                      required
                    />
                  </Grid>
                )}
              </Grid>


              {metodoPagamento === "multibanco" && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      ref={stripeRef}
                      amount={total}
                      onSuccess={() => mostrarAlertaSucessoERedirecionar("Pagamento realizado com Multibanco!")}
                    />
                  </Elements>
                </Grid>
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





