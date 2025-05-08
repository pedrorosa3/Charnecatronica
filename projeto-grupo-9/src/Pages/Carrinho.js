import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Header from "../Components/Header";
import { useCarrinho } from "../Context/CarrinhoContext";
import { useNavigate } from "react-router-dom"; // <--- Import do React Router

export default function Carrinho() {
  const { carrinho, atualizarQuantidade } = useCarrinho();
  const navigate = useNavigate(); // <--- Hook para navegação

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleAtualizarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      setSnackbarMessage("Produto removido do carrinho");
      setSnackbarOpen(true);
    }
    atualizarQuantidade(id, novaQuantidade);
  };

  const subtotal = carrinho.reduce((total, item) => {
    return total + parseFloat(item.preco) * item.quantidade;
  }, 0);

  const tax = subtotal * (23 / 123); // IVA incluído
  const total = subtotal;

  return (
    <>
      <Header />
      <Box mt={12} p={4}>
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          Carrinho ({carrinho.length} produtos)
        </Typography>

        {carrinho.length === 0 ? (
          <Typography variant="body1" textAlign="center" mt={5}>
            O seu carrinho está vazio.
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#f4f4f4",
                borderRadius: "8px",
                mb: 2,
              }}
            >
              <Box sx={{ width: "50%" }}>
                <Typography variant="subtitle1">Produto</Typography>
              </Box>
              <Box sx={{ width: "15%", textAlign: "center" }}>
                <Typography variant="subtitle1">Preço</Typography>
              </Box>
              <Box sx={{ width: "20%", textAlign: "center" }}>
                <Typography variant="subtitle1">Quantidade</Typography>
              </Box>
              <Box sx={{ width: "15%", textAlign: "right" }}>
                <Typography variant="subtitle1">Total</Typography>
              </Box>
            </Box>

            {carrinho.map((item) => (
              <Paper
                key={item.id}
                sx={{ mb: 2, p: 2, minHeight: "160px" }}
                elevation={2}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "140px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={item.imagem || "/placeholder.png"}
                        alt={item.modelo}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography fontWeight="bold">
                      {item.marca} {item.modelo || item.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tipo: {item.tipo || item.categoria}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography textAlign="center">
                      {parseFloat(item.preco).toFixed(2)} €
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <IconButton
                        onClick={() =>
                          handleAtualizarQuantidade(
                            item.id,
                            item.quantidade - 1
                          )
                        }
                      >
                        <Remove />
                      </IconButton>
                      <Typography>{item.quantidade}</Typography>
                      <IconButton
                        onClick={() =>
                          atualizarQuantidade(item.id, item.quantidade + 1)
                        }
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography fontWeight="bold" textAlign="right">
                      {(parseFloat(item.preco) * item.quantidade).toFixed(2)} €
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </>
        )}

        {carrinho.length > 0 && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Typography>IVA (23%) : {tax.toFixed(2)} €</Typography>
              <Typography variant="h6" mt={2} fontWeight="bold">
                Total: {total.toFixed(2)} €
              </Typography>
              <Typography variant="body2" color="green" mt={1}>
                Tem direito a envio gratuito.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, px: 4 }}
                onClick={() => navigate("/checkout", { state: { total, carrinho } })}
              >
                Finalizar Compra
              </Button>
                
            </Box>
          </>
        )}
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
    </>
  );
}
