import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Slide,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#22221F", padding: "10px 0", zIndex: 1301 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Ícone do menu lateral */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenu}
          >
            <MenuIcon sx={{ color: "#FFFFFF" }} />
          </IconButton>

          {/* Nome da Loja */}
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#FFFFFF" }}
          >
            Charnecatrónica
          </Typography>

          {/* Barra de Pesquisa Centralizada */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Pesquisar..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "#FFF",
                borderRadius: "25px",
                width: "50%", // Ajuste para alinhar com o título
                minWidth: "400px", // Largura mínima para evitar distorções
                maxWidth: "700px", // Largura máxima para manter proporção
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  "& fieldset": {
                    borderColor: "#CCC",
                  },
                  "&:hover fieldset": {
                    borderColor: "#AAA",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFFFFF",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#888" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Ícones de Conta e Carrinho */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit">
              <ShoppingCartIcon sx={{ color: "#FFFFFF" }} />
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon sx={{ color: "#FFFFFF" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Espaço reservado para evitar sobreposição com o conteúdo */}
      <Box sx={{ height: "64px" }} />

      {/* Menu lateral que desliza suavemente */}
      <Slide direction="down" in={menuOpen} mountOnEnter unmountOnExit>
        <Paper
          ref={menuRef}
          elevation={4}
          sx={{
            position: "absolute",
            top: "82px",
            left: 0,
            width: "250px",
            backgroundColor: "#22221F",
            zIndex: 1300,
          }}
        >
          <List>
            {["Início", "Comprar", "Vender", "Doar"].map((text, index) => (
              <ListItem
                button
                key={index}
                component={Link}
                to={text.toLowerCase()}
                onClick={() => setMenuOpen(false)}
              >
                <ListItemText
                  primary={text}
                  sx={{ color: "#FFFFFF", textAlign: "center" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Slide>
    </>
  );
};

export default Header;
