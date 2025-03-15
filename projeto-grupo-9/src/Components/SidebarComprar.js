import React from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Slider,
  List,
  ListItem,
} from "@mui/material";

const categorias = ["Telemóveis", "Portáteis", "Monitores", "Tablets"];
const ofertas = ["Novidades", "Mais Vendidos", "Promoções"];

const SidebarComprar = ({
  selectedCategories,
  setSelectedCategories,
  preco,
  setPreco,
  selectedOfertas,
  setSelectedOfertas,
}) => {
  // Atualiza categorias selecionadas
  const handleCategoryChange = (categoria) => {
    setSelectedCategories((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    );
  };

  // Atualiza faixa de preço via Slider
  const handleSliderChange = (event, newValue) => {
    setPreco(newValue);
  };

  // Atualiza faixa de preço via inputs manuais
  const handleInputChange = (event, index) => {
    const newPreco = [...preco];
    newPreco[index] =
      event.target.value === "" ? "" : Number(event.target.value);
    setPreco(newPreco);
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
                  checked={selectedCategories.includes(categoria)}
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
        Preço
      </Typography>
      <Slider
        value={preco}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0}
        max={4000}
        sx={{ width: "90%", marginTop: "10px" }}
      />
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <TextField
          type="number"
          value={preco[0]}
          onChange={(event) => handleInputChange(event, 0)}
          variant="outlined"
          size="small"
          sx={{ width: "80px" }}
        />
        <Typography>-</Typography>
        <TextField
          type="number"
          value={preco[1]}
          onChange={(event) => handleInputChange(event, 1)}
          variant="outlined"
          size="small"
          sx={{ width: "85px" }}
        />
      </Box>

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
                  checked={selectedOfertas.includes(oferta)}
                  onChange={() =>
                    setSelectedOfertas((prev) =>
                      prev.includes(oferta)
                        ? prev.filter((o) => o !== oferta)
                        : [...prev, oferta]
                    )
                  }
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
