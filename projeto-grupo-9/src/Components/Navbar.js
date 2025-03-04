import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#2C2C2C", padding: "5px 0" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#E9C46A", fontWeight: "bold" }}>Início</Link>
          <Link to="/comprar" style={{ textDecoration: "none", color: "#E9C46A", fontWeight: "bold" }}>Comprar</Link>
          <Link to="/vender" style={{ textDecoration: "none", color: "#E9C46A", fontWeight: "bold" }}>Vender</Link>
          <Link to="/doar" style={{ textDecoration: "none", color: "#E9C46A", fontWeight: "bold" }}>Doar</Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
