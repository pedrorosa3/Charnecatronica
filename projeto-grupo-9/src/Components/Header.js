import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Slide, Paper, List, ListItem, ListItemText} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
      <AppBar position="fixed" sx={{ backgroundColor: "#2A2A2A", padding: "10px 0", zIndex: 1301 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "#F4A261" }}>
            Loja de eletrónica usada
          </Typography>
          <IconButton color="inherit" sx={{ color: "#E9C46A" }}>
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ color: "#E9C46A" }}>
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Slide direction="down" in={menuOpen} mountOnEnter unmountOnExit>
        <Paper 
          ref={menuRef} 
          elevation={4} 
          sx={{ 
            position: "absolute", 
            top: "80px", 
            left: 0, 
            width: "250px", 
            backgroundColor: "#2C2C2C", 
            zIndex: 1300 
          }}
        >
          <List>
            {["Início", "Comprar", "Vender", "Doar"].map((text, index) => (
              <ListItem button key={index} component={Link} to={text.toLowerCase()} onClick={() => setMenuOpen(false)}>
                <ListItemText primary={text} sx={{ color: "#E9C46A", textAlign: "center" }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Slide>
    </>
  );
};

export default Header;

