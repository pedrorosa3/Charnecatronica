import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Header from "../Components/Header";
import { useCarrinho } from "../Context/CarrinhoContext";

export default function Carrinho() {
  const { carrinho, atualizarQuantidade } = useCarrinho();

  const subtotal = carrinho.reduce((total, item) => {
    return total + item.preco * item.quantidade;
  }, 0);

  const tax = subtotal * 0.1; // exemplo: 10% de imposto
  const total = subtotal + tax;

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
          carrinho.map((item) => (
            <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <img
                    src={item.imagem || "/placeholder.png"}
                    alt={item.modelo}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
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
                  <Typography>{item.preco.toFixed(2)} €</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      onClick={() =>
                        atualizarQuantidade(
                          item.id,
                          Math.max(1, item.quantidade - 1)
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
                  <Typography fontWeight="bold">
                    {(item.preco * item.quantidade).toFixed(2)} €
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))
        )}

        {carrinho.length > 0 && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Typography>Subtotal: {subtotal.toFixed(2)} €</Typography>
              <Typography>Taxa (10%): {tax.toFixed(2)} €</Typography>
              <Typography variant="h6" mt={2} fontWeight="bold">
                Total: {total.toFixed(2)} €
              </Typography>
              <Typography variant="body2" color="green" mt={1}>
                Parabéns, tem direito a envio gratuito.
              </Typography>
              <Button variant="contained" sx={{ mt: 2, px: 4 }}>
                Finalizar Compra
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
