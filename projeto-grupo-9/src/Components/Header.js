import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#F8F8F8",
        padding: "10px 0",
        borderBottom: "2px solid #E0E0E0",
        width: "100vw",
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
        {/*Box com os elementos todos*/}
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

          {/*SearchBar*/}
          <TextField
            variant="outlined"
            placeholder="Pesquisar"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "#E0E0E0",
              borderRadius: "25px",
              width: "50%",
              minWidth: "250px",
              maxWidth: "700px",
              marginRight: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  borderColor: "#AAA",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#000",
                },
                "& input": {
                  padding: "10px 14px",
                },
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

          {/*Box que contem a "navbar"*/}
          <Box
            sx={{
              display: "flex",
              gap: "40px",
              flexGrow: 1,
              paddingLeft: "100px",
            }}
          >
            <Link
              to="/comprar"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Comprar
            </Link>
            <Link
              to="/vender"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Vender
            </Link>
            <Link
              to="/doar"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Doar
            </Link>
            <Link
              to="/avarias"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Avarias
            </Link>
            <Link
              to="/tracking"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Tracking
            </Link>
            <Link
              to="/orcamento"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Pedido de orçamento
            </Link>
          </Box>

          {/*Box dos icones*/}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginRight: "30px",
            }}
          >
            {/* Link envolve o IconButton para redirecionar para a página de login */}
            <Link to="/login" style={{ textDecoration: "none" }}>
              <IconButton color="inherit">
                <AccountCircleIcon sx={{ color: "#000", fontSize: "30px" }} />
              </IconButton>
            </Link>
            <IconButton color="inherit">
              <ShoppingCartIcon sx={{ color: "#000", fontSize: "30px" }} />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
