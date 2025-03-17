import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SidebarComprar from "../Components/SidebarComprar";

const Input = styled("input")({
  display: "none",
});

const VenderPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando dados para avaliação:", formData);
    alert("Produto enviado para avaliação!");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
      }}
    >
      <Header /> {/* Cabeçalho */}
      <Box sx={{ display: "flex", flex: 1, paddingTop: "80px" }}>
        {/* Sidebar */}
        <SidebarComprar
          selectedCategories={[]}
          setSelectedCategories={() => {}}
          preco={[0, 2000]}
          setPreco={() => {}}
          selectedOfertas={[]}
          setSelectedOfertas={() => {}}
        />
        {/* Conteúdo de Venda */}
        <Box sx={{ flex: 1, padding: "20px" }}>
          <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "15px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Venda Seu Equipamento
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nome do Produto"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                <TextField
                  fullWidth
                  label="Preço"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <label htmlFor="image-upload">
                  <Input
                    accept="image/*"
                    id="image-upload"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <Button variant="contained" component="span" sx={{ mt: 2 }}>
                    Upload de Fotos
                  </Button>
                </label>
                {formData.images.length > 0 && (
                  <Typography sx={{ mt: 1 }}>
                    {formData.images.length} imagem(ns) selecionada(s)
                  </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                  Submeter
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Footer /> {/* Rodapé */}
    </Box>
  );
};

export default VenderPage;
