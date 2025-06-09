import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Avatar,
  Card,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Interesses = () => {
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [interesses, setInteresses] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchInteresses = async () => {
      try {
        const res = await fetch(`http://localhost:9000/interesses?email=${user?.email}`);
        if (!res.ok) throw new Error("Erro ao buscar interesses.");
        const data = await res.json();
        setInteresses(data || []);
      } catch (error) {
        console.error(error);
        setSnackbar({ open: true, message: "Erro ao carregar interesses", severity: "error" });
      }
    };

    if (user?.email) fetchInteresses();
  }, [user?.email]);

  if (isLoading) return <p>Carregando...</p>;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1, paddingTop: "80px" }}>
        {/* Lado esquerdo com dados do utilizador */}
        <Box
          sx={{
            width: "280px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h6">{user?.name}</Typography>
          <Typography variant="body2" color="textSecondary">{user?.email}</Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/perfil")}
            sx={{ mt: 2, borderColor: "#000", color: "#000" }}
          >
            Voltar ao Perfil
          </Button>
        </Box>

        {/* Lado direito com interesses */}
        <Container sx={{ flex: 1, padding: "30px" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "black",
              "&:hover": { backgroundColor: "#333" },
              ml: 2,
            }}
            component={Link}
            to="/adicionar-interesse"
          >
            Adicionar Interesse
          </Button>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Meus Interesses
          </Typography>

          {interesses.length === 0 ? (
            <Typography>Não há interesses registados.</Typography>
          ) : (
            <List>
              {interesses.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          )}
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default Interesses;
