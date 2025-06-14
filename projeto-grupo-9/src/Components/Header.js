import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Badge,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { useCarrinho } from "../Context/CarrinhoContext";
import { useAuth0 } from "@auth0/auth0-react";
import IconInteresses from "../Components/IconInteresses";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipamentos, setEquipamentos] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();

  const { carrinho } = useCarrinho();
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } =
    useAuth0();

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

    setFilteredSuggestions(resultados.slice(0, 5));
  }, [searchTerm, equipamentos]);

  const handleSuggestionClick = (id) => {
    setSearchTerm("");
    setFilteredSuggestions([]);
    navigate(`/produto/${id}`);
  };

  if (isLoading) return null;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#F8F8F8",
        padding: "15px 0",
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

          <Box sx={{ position: "relative", width: "38%" }}>
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
              gap: "45px",
              flexGrow: 1,
              paddingLeft: "30px",
            }}
          >
            {[
              { label: "Comprar", path: "/comprar" },
              { label: "Vender", path: "/venderCliente" },
              { label: "Reparar", path: "/reparacoesCliente" },
              { label: "Doar", path: "/doar" },
              { label: "Onde estamos", path: "/lojasCliente" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "#000",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginRight: "50px",
              marginLeft: "30px",
            }}
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <Avatar src={user.picture} alt={user.name} />
                </Link>

                <Link
                  to="/perfil"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#000" }}
                  >
                    {user.name.split(" ")[0]}
                  </Typography>
                </Link>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: "#F8F8F8",
                    color: "#000",
                    border: "2px solid #000",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#000",
                      color: "#fff",
                      border: "2px solid #000",
                    },
                  }}
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "#F8F8F8",
                  color: "#000",
                  border: "2px solid #000",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "2px solid #000",
                  },
                }}
                onClick={() => loginWithRedirect()}
              >
                Login
              </Button>
            )}

            <IconInteresses />
            <Box
              component={Link}
              to="/carrinho"
              sx={{ display: "flex", alignItems: "center", ml: "10px" }}
            >
              <Badge
                badgeContent={totalItens}
                color="error"
                overlap="circular"
                invisible={totalItens === 0}
              >
                <ShoppingCartIcon sx={{ color: "#000", fontSize: "30px" }} />
              </Badge>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
