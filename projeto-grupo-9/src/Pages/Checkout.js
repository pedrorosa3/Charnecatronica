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

const stripePromise = loadStripe("pk_test_51Rbk4bQvL5RrY99cM37RBfbSyE8ariILR2U2UzYOLvEyLrQPTKYwfSFLYB1jGCqau7pRY1uXSr03wi9NKhqjtwLH00NFO6SaNx");

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
    morada: {
      pais: "Portugal",
      localidade: "",
      latitude: null,
      longitude: null,
      freguesia: "",
      rua: "",
      numero: "",
      codigopostal: "",
      concelho: "",
      distrito: "",
    },
    telefone: "",
  });

  const mapRef = useRef(null);
  const mapa = useRef(null);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
  if (!window.google) {
    console.error("Google Maps JavaScript API não carregada");
    return;
  }
  if (inputRef.current) {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "pt" }, // restringe a Portugal
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.address_components) {
        return;
      }

      // Extrai componentes do endereço
      const addressComponents = place.address_components;

      const getComponent = (types) =>
        addressComponents.find((component) =>
          types.every((type) => component.types.includes(type))
        )?.long_name || "";

      setFormData((prev) => ({
        ...prev,
        morada: {
          ...prev.morada,
          rua: `${getComponent(["route"])} ${getComponent(["street_number"])}`.trim(),
          localidade: getComponent(["locality"]) || getComponent(["sublocality"]),
          freguesia: getComponent(["administrative_area_level_3"]),
          concelho: getComponent(["administrative_area_level_2"]),
          distrito: getComponent(["administrative_area_level_1"]),
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          codigopostal: getComponent(["postal_code"]),
          pais: getComponent(["country"]) || "Portugal",
        },
      }));
    });
  }
}, []);


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
    formData.morada.rua,
    formData.morada.numero,
    formData.morada.codigopostal, // conserte nome no estado
    formData.morada.localidade, // ou cidade, dependendo do seu campo, use localidade
    formData.telefone,
    metodoPagamento,
  ];

  // valida mbway
  if (metodoPagamento === "mbway" && !numeroMbway.match(/^9[0-9]{8}$/)) {
    return false;
  }

  // Verifica se todos os campos estão preenchidos e não vazios
  return camposObrigatorios.every((campo) => campo && campo.toString().trim() !== "");
};


  const handleFinalizarCompra = async () => {
    if (!isFormValid()) {
      setAlerta({ tipo: "error", texto: "Por favor, preencha todos os campos corretamente." });
      return;
    }

    console.log("Dados morada enviados:", {
      rua: formData.morada.rua,
      numero: formData.morada.numero,
      codigopostal: formData.morada.codigopostal,
      localidade: formData.morada.localidade,
      freguesia: formData.morada.freguesia,
      concelho: formData.morada.concelho,
      distrito: formData.morada.distrito,
      pais: formData.morada.pais,
      latitude: formData.morada.latitude,
      longitude: formData.morada.longitude,
    });

    try {
      // Envia a morada
      const responseMorada = await fetch(process.env.REACT_APP_URL_HOST+"/morada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rua: formData.morada.rua,
        numero: formData.morada.numero,
        codigopostal: formData.morada.codigopostal,
        localidade: formData.morada.localidade,
        freguesia: formData.morada.freguesia,
        concelho: formData.morada.concelho,
        distrito: formData.morada.distrito,
        pais: formData.morada.pais,
        latitude: formData.morada.latitude,
        longitude: formData.morada.longitude,
      }),
    });

      if (!responseMorada.ok) throw new Error("Erro ao enviar dados da morada.");
      const dataMorada = await responseMorada.json();
      const moradaId = dataMorada.id || dataMorada.moradaId;

      // Envia os dados da pessoa
      const responsePessoa = await fetch(process.env.REACT_APP_URL_HOST+"/pessoa", {
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
        const paymentIntentResponse = await fetch(process.env.REACT_APP_URL_HOST+"/create-payment-intent", {
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
      const responseVenda = await fetch(process.env.REACT_APP_URL_HOST+"/venda", {
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
                    fullWidth
                    inputRef={inputRef}
                    label="Pesquisar Morada"
                    value={formData.morada.rua}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, morada: { ...prev.morada, rua: e.target.value } }))
                    }
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Número da Porta"
                    value={formData.morada.numero}
                    onChange={(e) => {
                      let valor = e.target.value.replace(/\D/g, ""); // só números
                      valor = valor.slice(0, 4);
                      setFormData((prev) => ({
                        ...prev,
                        morada: { ...prev.morada, numero: valor },
                      }));
                    }}
                    margin="normal"
                    required
                    inputProps={{ inputMode: "numeric", maxLength: 4 }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="Localidade" value={formData.morada.localidade} margin="normal" disabled />
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="Freguesia" value={formData.morada.freguesia} margin="normal" disabled />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Concelho" value={formData.morada.concelho} margin="normal" disabled />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Distrito" value={formData.morada.distrito} margin="normal" disabled />
                </Grid>


                <Grid item xs={12}>
                  <TextField
                    label="Telemóvel"
                    fullWidth
                    required
                    value={formData.telefone}
                    onChange={(e) => {
                      let valor = e.target.value.replace(/\D/g, "").slice(0, 9); // Só números e máximo 9 dígitos
                      if (valor && valor[0] !== "9") valor = "9" + valor.slice(1); // Força começar com 9
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









