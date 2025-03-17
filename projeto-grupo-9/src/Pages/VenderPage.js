import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { styled } from "@mui/system"; // Mantenha o styled importado
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Input = styled("input")({
  display: "none",
});

const VenderPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // Categoria do produto
    images: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;

    // Impedir que o valor contenha mais de duas casas decimais
    const regex = /^(\d*\.?\d{0,2})/;
    let formattedValue = value.match(regex) ? value.match(regex)[0] : "";

    // Prevenir valores negativos
    if (formattedValue === "" || parseFloat(formattedValue) < 0) {
      formattedValue = "";
    }

    setFormData({ ...formData, price: formattedValue });
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
        {/* Container para o Formulário */}
        <Container maxWidth="sm" sx={{ flex: 1, padding: "20px" }}>
          <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
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
                  sx={{
                    backgroundColor: "#F5F5F5", // fundo de campo de entrada
                    borderRadius: "5px",
                  }}
                />
                
                {/* Categoria */}
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="category-label">Categoria</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    sx={{
                      backgroundColor: "#F5F5F5", // fundo de campo de entrada
                      borderRadius: "5px",
                    }}
                  >
                    <MenuItem value="Telemóveis">Telemóveis</MenuItem>
                    <MenuItem value="Portáteis">Portáteis</MenuItem>
                    <MenuItem value="Monitores">Monitores</MenuItem>
                    <MenuItem value="Tablets">Tablets</MenuItem>
                  </Select>
                </FormControl>

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
                  sx={{
                    backgroundColor: "#F5F5F5", // fundo de campo de entrada
                    borderRadius: "5px",
                  }}
                />
                <TextField
                  fullWidth
                  label="Preço"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  margin="normal"
                  required
                  placeholder="0,00€" // Valor inicial como placeholder
                  sx={{
                    backgroundColor: "#F5F5F5", // fundo de campo de entrada
                    borderRadius: "5px",
                  }}
                />

                <label htmlFor="image-upload">
                  <Input
                    accept="image/*"
                    id="image-upload"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    sx={{
                      mt: 2,
                      backgroundColor: "#000", // cor de fundo preta
                      color: "#fff", // cor do texto branca
                      "&:hover": {
                        backgroundColor: "#333", // cor de fundo no hover
                      },
                    }}
                  >
                    Upload de Fotos
                  </Button>
                </label>

                {formData.images.length > 0 && (
                  <Typography sx={{ mt: 1 }}>
                    {formData.images.length} imagem(ns) selecionada(s)
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    backgroundColor: "#000", // cor de fundo preta
                    color: "#fff", // cor do texto branca
                    "&:hover": {
                      backgroundColor: "#333", // cor de fundo no hover
                    },
                  }}
                >
                  Submeter
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Footer /> {/* Rodapé */}
    </Box>
  );
};

export default VenderPage;



