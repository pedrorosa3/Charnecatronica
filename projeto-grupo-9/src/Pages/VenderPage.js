import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const VenderPage = () => {
  const [formData, setFormData] = useState({
    preco: "",
    clienteID: 1,
    empregadoID: 1,
    lojaNIPC: 123456789,
    equipamentoID: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9000/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Compra registada com sucesso!");
        setFormData({
          preco: "",
          clienteID: 1,
          empregadoID: 1,
          lojaNIPC: 123456789,
          equipamentoID: 1,
        });
      } else {
        alert("Erro ao registar compra.");
      }
    } catch (error) {
      console.error("Erro ao registar compra:", error);
      alert("Erro ao conectar-se ao servidor.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "row", height: "50vh", backgroundColor: "black" }}>
        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            Registo de Compra
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            Preencha os dados para registar uma compra.
          </Typography>
        </Box>
        <Box sx={{ width: "60%", display: "flex", justifyContent: "center", alignItems: "flex-start", backgroundColor: "black" }}>
          <Box
            sx={{
              width: "80%",
              height: "82.7%",
              backgroundImage: "url(/images/vendas.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
              borderTop: "80px solid black",
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", flex: 1, paddingTop: "20px" }}>
        <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
          <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                Nova Compra
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                />
                <TextField
                  fullWidth
                  label="Cliente ID"
                  name="clienteID"
                  type="number"
                  value={formData.clienteID}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                />
                <TextField
                  fullWidth
                  label="Empregado ID"
                  name="empregadoID"
                  type="number"
                  value={formData.empregadoID}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                />
                <TextField
                  fullWidth
                  label="Loja NIPC"
                  name="lojaNIPC"
                  type="number"
                  value={formData.lojaNIPC}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                />
                <TextField
                  fullWidth
                  label="Equipamento ID"
                  name="equipamentoID"
                  type="number"
                  value={formData.equipamentoID}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, backgroundColor: "#000", color: "#fff", py: 1, "&:hover": { backgroundColor: "#333" } }}
                >
                  Submeter Compra
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default VenderPage;







