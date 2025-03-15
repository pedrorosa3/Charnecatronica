import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  List,
  ListItem,
} from "@mui/material";

const categorias = ["Telemóveis", "Portáteis", "Monitores"];
const ofertas = ["Novidades", "Mais Vendidos", "Promoções"];

const SidebarComprar = ({
  selectedCategories,
  setSelectedCategories,
  preco,
  setPreco,
  selectedOfertas,
  setSelectedOfertas,
}) => {
  // Estados locais para garantir que, por padrão, nenhum filtro esteja ativo
  const [localCategories, setLocalCategories] = useState(
    selectedCategories || []
  );
  const [localOfertas, setLocalOfertas] = useState(selectedOfertas || []);
  const [localPreco, setLocalPreco] = useState(preco || [0, 2000]);

  // Atualiza categorias selecionadas
  const handleCategoryChange = (categoria) => {
    const updatedCategories = localCategories.includes(categoria)
      ? localCategories.filter((c) => c !== categoria)
      : [...localCategories, categoria];

    setLocalCategories(updatedCategories);
    if (setSelectedCategories) setSelectedCategories(updatedCategories);
  };

  // Atualiza ofertas selecionadas
  const handleOfertasChange = (oferta) => {
    const updatedOfertas = localOfertas.includes(oferta)
      ? localOfertas.filter((o) => o !== oferta)
      : [...localOfertas, oferta];

    setLocalOfertas(updatedOfertas);
    if (setSelectedOfertas) setSelectedOfertas(updatedOfertas);
  };

  // Atualiza faixa de preço
  const handlePrecoChange = (event, newValue) => {
    setLocalPreco(newValue);
    if (setPreco) setPreco(newValue);
  };

  return (
    <Box
      sx={{
        width: "250px",
        padding: "20px",
        borderRight: "1px solid #E0E0E0",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Filtro de Categoria */}
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "10px" }}>
        Categorias
      </Typography>
      <List>
        {categorias.map((categoria) => (
          <ListItem key={categoria} disablePadding>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localCategories.includes(categoria)}
                  onChange={() => handleCategoryChange(categoria)}
                />
              }
              label={categoria}
            />
          </ListItem>
        ))}
      </List>

      {/* Filtro de Preço */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ marginTop: "20px", marginBottom: "10px" }}
      >
        Faixa de Preço
      </Typography>
      <Slider
        value={localPreco}
        onChange={handlePrecoChange}
        valueLabelDisplay="auto"
        min={0}
        max={2000}
        sx={{ width: "90%" }}
      />

      {/* Filtro de Ofertas */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ marginTop: "20px", marginBottom: "10px" }}
      >
        Ofertas
      </Typography>
      <List>
        {ofertas.map((oferta) => (
          <ListItem key={oferta} disablePadding>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localOfertas.includes(oferta)}
                  onChange={() => handleOfertasChange(oferta)}
                />
              }
              label={oferta}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SidebarComprar;
