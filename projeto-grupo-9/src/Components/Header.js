import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Badge,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useCarrinho } from "../Context/CarrinhoContext";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipamentos, setEquipamentos] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();

  const { carrinho } = useCarrinho();
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  useEffect(() => {
    fetch("http://localhost:9000/equipamentos")
      .then((res) => res.json())
      .then((data) => setEquipamentos(data))
      .catch((err) => console.error("Erro ao buscar equipamentos:", err));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const termo = searchTerm.toLowerCase();
    const resultados = equipamentos.filter((equip) =>
      `${equip.nome} ${equip.marca ?? ""} ${equip.modelo ?? ""} ${
        equip.tipo ?? ""
      }`
        .toLowerCase()
        .includes(termo)
    );

    setFilteredSuggestions(resultados.slice(0, 5)); // max 5 sugestões
  }, [searchTerm, equipamentos]);

  const handleSuggestionClick = (id) => {
    setSearchTerm("");
    setFilteredSuggestions([]);
    navigate(`/produto/${id}`);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#F8F8F8",
          padding: "10px 0",
          borderBottom: "2px solid #E0E0E0",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#000", marginLeft: "10px", paddingRight: "35px" }}
              >
                Charnecatrónica
              </Typography>
            </Link>

            <Box sx={{ position: "relative", width: "40%" }}>
              <TextField
                variant="outlined"
                placeholder="Pesquisar"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: "#E0E0E0",
                  borderRadius: "25px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { borderColor: "#AAA" },
                    "&.Mui-focused fieldset": { borderColor: "#000" },
                    "& input": { padding: "10px 14px" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: "#777", cursor: "pointer" }} />
                    </InputAdornment>
                  ),
                }}
              />
              {filteredSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "40px",
                    left: 0,
                    right: 0,
                    zIndex: 10,
                  }}
                >
                  <List dense>
                    {filteredSuggestions.map((equip) => (
                      <ListItem
                        button
                        key={equip.id}
                        onClick={() => handleSuggestionClick(equip.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          paddingY: 1.5,
                          minHeight: 70,
                        }}
                      >
                        <Box
                          component="img"
                          src={equip.imagem}
                          alt={equip.nome}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "contain",
                            borderRadius: 1,
                            border: "1px solid #ccc",
                            backgroundColor: "#fff",
                          }}
                        />
                        <ListItemText
                          primary={equip.nome}
                          secondary={equip.categoria}
                          primaryTypographyProps={{
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                          secondaryTypographyProps={{
                            fontSize: "14px",
                            color: "gray",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "40px",
                flexGrow: 1,
                paddingLeft: "100px",
              }}
            >
              {[
                "comprar",
                "vender",
                "doar",
                "avarias",
                "tracking",
                "orcamento",
              ].map((page) => (
                <Link
                  key={page}
                  to={`/${page}`}
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    fontWeight: "600",
                    fontSize: "18px",
                  }}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Link>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                marginRight: "30px",
              }}
            >
              <Link to="/login" style={{ textDecoration: "none" }}>
                <IconButton color="inherit">
                  <AccountCircleIcon sx={{ color: "#000", fontSize: "30px" }} />
                </IconButton>
              </Link>
              <Link to="/carrinho" style={{ textDecoration: "none" }}>
                <IconButton color="inherit">
                  <Badge
                    badgeContent={totalItens}
                    color="error"
                    overlap="circular"
                    invisible={totalItens === 0}
                  >
                    <ShoppingCartIcon
                      sx={{ color: "#000", fontSize: "30px" }}
                    />
                  </Badge>
                </IconButton>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
