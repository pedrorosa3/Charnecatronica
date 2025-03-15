import React from "react";
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
  // Atualiza categorias selecionadas
  const handleCategoryChange = (categoria) => {
    setSelectedCategories((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    );
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
        Faixa de Preço
      </Typography>
      <Slider
        value={preco}
        onChange={(event, newValue) => setPreco(newValue)}
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
