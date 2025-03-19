import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { styled } from "@mui/system";
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
    category: "",
    images: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    const regex = /^(\d*\.?\d{0,2})/;
    let formattedValue = value.match(regex) ? value.match(regex)[0] : "";
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
    console.log("Dados do formulário enviados para avaliação:", formData);
    alert("Produto enviado para avaliação!");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Header />

      <Box sx={{ display: "flex", flexDirection: "row", height: "50vh", backgroundColor: "black" }}>
        <Box sx={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px", color: "white", backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            Demonstre o desejo de vender o seu produto.
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            A nossa plataforma oferece uma maneira simples e segura de vender seu equipamento.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Preencha o formulário abaixo e nossa equipe entrará em contacto.
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
                Venda Seu Equipamento
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Nome do Produto" name="name" value={formData.name} onChange={handleChange} margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }} />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="category-label">Categoria</InputLabel>
                  <Select labelId="category-label" id="category" name="category" value={formData.category} onChange={handleChange} sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                    <MenuItem value="Telemóveis">Telemóveis</MenuItem>
                    <MenuItem value="Portáteis">Portáteis</MenuItem>
                    <MenuItem value="Monitores">Monitores</MenuItem>
                    <MenuItem value="Tablets">Tablets</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Descrição" name="description" value={formData.description} onChange={handleChange} margin="normal" multiline rows={4} required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }} />
                <TextField fullWidth label="Preço" name="price" type="text" value={formData.price} onChange={handlePriceChange} margin="normal" required placeholder="0,00€" sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }} />
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "2px solid #E0E0E0", borderRadius: "10px", padding: "30px", marginTop: "20px", cursor: "pointer", minHeight: "100px", backgroundColor: "#FFF" }}>
                  <label htmlFor="image-upload">
                    <Input accept="image/*" id="image-upload" multiple type="file" onChange={handleImageUpload} />
                    <Button variant="contained" component="span" sx={{ mt: 2, py: 2, backgroundColor: "#000", color: "#FFF", "&:hover": { backgroundColor: "#333" } }}>Adicionar Fotografias</Button>
                  </label>
                  {formData.images.length > 0 && (
                    <Typography sx={{ mt: 2, color: "#000" }}>{formData.images.length} {formData.images.length === 1 ? "imagem selecionada" : "imagens selecionadas"}</Typography>
                  )}
                </Box>
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, backgroundColor: "#000", color: "#fff", py: 1, "&:hover": { backgroundColor: "#333" } }}>Submeter</Button>
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






