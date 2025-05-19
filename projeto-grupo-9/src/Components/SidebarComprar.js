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
  Radio,
  RadioGroup,
} from "@mui/material";

const categorias = ["Telemóveis", "Portáteis", "Monitores", "Tablets"];
const estados = ["Novo", "Semi-novo", "Usado", "Muito usado"];

const SidebarComprar = ({
  selectedCategories,
  setSelectedCategories,
  selectedEstados,
  setSelectedEstados,
  preco,
  setPreco,
  ordenacao,
  setOrdenacao,
}) => {
  const handleCategoryChange = (categoria) => {
    setSelectedCategories((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    );
  };

  const handleSliderChange = (_, newValue) => {
    setPreco(newValue);
  };

  const handleInputChange = (event, index) => {
    const newPreco = [...preco];
    newPreco[index] =
      event.target.value === "" ? "" : Number(event.target.value);
    setPreco(newPreco);
  };

  const handleEstadoChange = (estado) => {
    setSelectedEstados((prev) =>
      prev.includes(estado)
        ? prev.filter((e) => e !== estado)
        : [...prev, estado]
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
      {/* Categorias */}
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

      {/* Estado */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ marginTop: "20px", marginBottom: "10px" }}
      >
        Estado
      </Typography>
      <List>
        {estados.map((estado) => (
          <ListItem key={estado} disablePadding>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedEstados.includes(estado)}
                  onChange={() => handleEstadoChange(estado)}
                />
              }
              label={estado}
            />
          </ListItem>
        ))}
      </List>

      {/* Preço */}
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

      {/* Ordenar por */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ marginTop: "20px", marginBottom: "10px" }}
      >
        Ordenar por
      </Typography>
      <RadioGroup
        value={ordenacao}
        onChange={(e) => setOrdenacao(e.target.value)}
      >
        <FormControlLabel
          value="recentes"
          control={<Radio />}
          label="Mais recentes"
        />
        <FormControlLabel
          value="preco_asc"
          control={<Radio />}
          label="Preço (ascendente)"
        />
        <FormControlLabel
          value="preco_desc"
          control={<Radio />}
          label="Preço (descendente)"
        />
      </RadioGroup>
    </Box>
  );
};

export default SidebarComprar;
