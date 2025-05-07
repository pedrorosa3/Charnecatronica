import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import StripePayment from "../Components/StripePayment";
import { useCarrinho } from "../Context/CarrinhoContext";

const stripePromise = loadStripe(
  "pk_test_51RKNAQLGKEXi0N5ltaZh7UDV9h5BGOCUrFQ9lzbWbbu77Amax7lgJ49Pw2ZM3dgSd2pxkuErF9fTB295ExHhKvtI00UR4JHQBj"
); // substitui com a tua public key Stripe

const CheckoutPagamento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripeRef = useRef();
  const { limparCarrinho } = useCarrinho(); // hook para limpar o carrinho

  const total = location.state?.total;
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [numeroMbway, setNumeroMbway] = useState("");
  const [alerta, setAlerta] = useState(null);

  const mostrarAlertaSucessoERedirecionar = (texto) => {
    setAlerta({ tipo: "success", texto });
    limparCarrinho(); // limpa o carrinho após o pagamento
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  const handleFinalizarCompra = async () => {
    if (metodoPagamento === "mbway") {
      if (!numeroMbway.match(/^9[0-9]{8}$/)) {
        setAlerta({ tipo: "error", texto: "Número MBWay inválido." });
        return;
      }

      mostrarAlertaSucessoERedirecionar("Compra realizada com MBWay!");
    }

    if (metodoPagamento === "multibanco") {
      if (stripeRef.current) {
        await stripeRef.current.handleStripePayment();
        mostrarAlertaSucessoERedirecionar("Pagamento realizado com Multibanco!");
      }
    }
  };

  if (!total) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box flex="1" mt={12} p={4} textAlign="center">
          <Typography color="error">Erro: Total não fornecido.</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" position="relative">
      <Header />

      {alerta?.tipo === "success" && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(0, 0, 0, 0.5)"
          zIndex={1300}
        >
          <Box
            bgcolor="white"
            p={4}
            borderRadius={2}
            boxShadow={6}
            textAlign="center"
            maxWidth="400px"
            width="90%"
          >
            <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
              Compra realizada com sucesso!
            </Typography>
            <Typography variant="body1">
              Obrigado por confiar em nós. Volte sempre!
            </Typography>
          </Box>
        </Box>
      )}

      <Box flex="1" display="flex" justifyContent="center" alignItems="center" p={2}>
        <Box width="100%" maxWidth="500px" p={4} boxShadow={3} borderRadius={2} bgcolor="white">
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Checkout
          </Typography>

          <Typography variant="h6" mb={2} textAlign="center">
            Total a pagar: {total.toFixed(2)} €
          </Typography>

          {alerta?.tipo === "error" && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {alerta.texto}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="metodo-label">Método de Pagamento</InputLabel>
            <Select
              labelId="metodo-label"
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              label="Método de Pagamento"
            >
              <MenuItem value="multibanco">Multibanco</MenuItem>
              <MenuItem value="mbway">MBWay</MenuItem>
            </Select>
          </FormControl>

          {metodoPagamento === "mbway" && (
            <TextField
              fullWidth
              label="Número MBWay"
              value={numeroMbway}
              onChange={(e) =>
                setNumeroMbway(e.target.value.replace(/\D/g, "").slice(0, 9))
              }
              inputProps={{ inputMode: "numeric", maxLength: 9 }}
              required
              sx={{ mb: 2 }}
            />
          )}

          {metodoPagamento === "multibanco" && (
            <Elements stripe={stripePromise}>
              <StripePayment
                ref={stripeRef}
                amount={total}
                onSuccess={() => mostrarAlertaSucessoERedirecionar("Pagamento realizado com Multibanco!")}
              />
            </Elements>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleFinalizarCompra}
            sx={{ mt: 3 }}
            disabled={!metodoPagamento}
          >
            Finalizar Compra
          </Button>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default CheckoutPagamento;


