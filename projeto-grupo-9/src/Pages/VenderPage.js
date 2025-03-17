import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography, Card, CardContent, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import { styled } from "@mui/system"; // Mantenha o styled importado
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Close as CloseIcon } from "@mui/icons-material"; // Importar o ícone de fechar

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
    console.log("Dados do formulário enviados para avaliação:", formData);
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

      {/* Seção de introdução antes do formulário */}
      <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Necessário para a sobreposição funcionar
    backgroundImage: "url(/images/vendas.jpeg)", // URL da imagem de fundo
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "black",
    height: "50vh", // altura da seção
    textAlign: "center",
    padding: "20px",
    overflow: "hidden",
  }}
>
  {/* Camada de desfoque sobre a imagem */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "url(/images/vendas.jpeg)", // Mesma imagem para sobreposição
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(5px)", // Aplica o desfoque à imagem
      opacity: 0.5, // Torna o efeito mais suave
      zIndex: 1, // Camada abaixo do texto
    }}
  />

  {/* Texto sobre a imagem */}
  <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "10px", zIndex: 2, position: "relative" }}>
    Demonstre o desejo de vender o seu produto, e nós entraremos em contacto com mais informações.
  </Typography>
  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "20px", zIndex: 2, position: "relative" }}>
    A nossa plataforma oferece uma maneira simples e segura de vender o seu equipamento com facilidade.
  </Typography>
  <Typography variant="body1" sx={{ fontWeight: "bold", zIndex: 2, position: "relative" }}>
    Preencha o formulário abaixo e nossa equipe entrará em contacto para orientá-lo em todo o processo.
  </Typography>
</Box>


      <Box sx={{ display: "flex", flex: 1, paddingTop: "20px" }}>
        {/* Container para o Formulário */}
        <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
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

                {/* Upload de Fotos - Novo Layout */}
                <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #E0E0E0", // Borda cinza clara, igual aos outros campos
    borderRadius: "10px",
    padding: "30px", // Maior padding para aumentar a caixa
    marginTop: "20px",
    cursor: "pointer",
    minHeight: "100px", // Caixa maior
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#FFF", // Fundo branco para destaque
  }}
>
  
 

  {/* Área de Upload de Imagem */}
  
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
          py:2,  
          backgroundColor: "#000", // Cor preta para o botão
          color: "#FFF",
          "&:hover": {
            backgroundColor: "#333", // Cinza escuro no hover
          },
        }}
      >
        Adicionar Fotografias
      </Button>
    </label>
  

  {/* Quantidade de imagens selecionadas */}
  {formData.images.length > 0 && (
    <Typography sx={{ mt: 2, color: "#000" }}>
      {formData.images.length} {formData.images.length === 1 ? "imagem selecionada" : "imagens selecionadas"}
    </Typography>
  )}
</Box>




                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    backgroundColor: "#000", // cor de fundo preta
                    color: "#fff",
                    py: 1, 
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







