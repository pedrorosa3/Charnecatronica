import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import Sidebar from "../Components/SideBarDashboard";

import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

const AdicionarProjetoPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    datalimite: "",
    quantidadeequipamentos: "", // Valor inicial como string
    nomeorganizador: "",
    nomeloja: "",
    imagem: "",
    fichaequipamentocodbarras: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Verificação para garantir que quantidadeequipamentos não seja negativa
    if (name === "quantidadeequipamentos" && value < 0) {
      return; // Não faz nada se o valor for negativo
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Garantir que a quantidade de equipamentos seja um número válido
    if (formData.quantidadeequipamentos < 0) {
      alert("A quantidade de equipamentos não pode ser negativa.");
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_URL_HOST+"/adicionar-projeto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Projeto adicionado com sucesso!");
        setFormData({
          nome: "",
          descricao: "",
          datalimite: "",
          quantidadeequipamentos: "",
          nomeorganizador: "",
          nomeloja: "",
          imagem: "",
          fichaequipamentocodbarras: "",
        });
        navigate("/doar");
      } else {
        alert("Erro ao adicionar projeto.");
      }
    } catch (error) {
      console.error("Erro ao adicionar projeto:", error);
      alert("Erro ao conectar-se ao servidor.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Sidebar />
      <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
        <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "20px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
              Adicionar Novo Projeto
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome do Projeto"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={4}
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Data Limite"
                name="datalimite"
                type="date"
                value={formData.datalimite}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Quantidade de Equipamentos"
                name="quantidadeequipamentos"
                type="number"
                value={formData.quantidadeequipamentos}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Nome do Organizador"
                name="nomeorganizador"
                value={formData.nomeorganizador}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Nome da Loja"
                name="nomeloja"
                value={formData.nomeloja}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Imagem (URL)"
                name="imagem"
                value={formData.imagem}
                onChange={handleChange}
                margin="normal"
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Código de Barras da Ficha de Equipamento"
                name="fichaequipamentocodbarras"
                value={formData.fichaequipamentocodbarras}
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
                Adicionar Projeto
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* Footer fixo no fundo */}
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

export default AdicionarProjetoPage;
