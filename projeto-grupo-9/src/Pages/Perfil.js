import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Perfil = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nome: user?.name || "",
    email: user?.email || "",
    nif: "",
    nic: "",
    genero: "",
    telemovel: "",
    dataNascimento: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!/^\d{9}$/.test(userData.nif)) {
      newErrors.nif = "NIF deve ter exatamente 9 dígitos";
    }
    if (!/^\d{8}$/.test(userData.nic)) {
      newErrors.nic = "NIC deve ter exatamente 8 dígitos";
    }
    if (!/^\d{9}$/.test(userData.telemovel)) {
        newErrors.telemovel = "O número de telemóvel deve ter exatamente 9 dígitos";
      }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const response = await fetch("http://localhost:9000/perfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("Dados salvos com sucesso!");
      navigate("/");
    } else {
      alert("Erro ao guardar dados.");
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1, paddingTop: "100px" }}>
        <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
          <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                Perfil do Utilizador
              </Typography>

              <TextField
                label="Nome"
                name="nome"
                value={userData.nome}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />

              <TextField
                label="Email"
                name="email"
                value={userData.email}
                fullWidth
                margin="normal"
                disabled
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />

              <TextField
                label="NIF"
                name="nif"
                value={userData.nif}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.nif}
                helperText={errors.nif}
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />

              <TextField
                label="NIC"
                name="nic"
                value={userData.nic}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.nic}
                helperText={errors.nic}
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />

              <TextField
                select
                label="Gênero"
                name="genero"
                value={userData.genero}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Feminino">Feminino</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
              </TextField>

              <TextField
                label="Telemóvel"
                name="telemovel"
                value={userData.telemovel}
                onChange={handleChange}
                error={!!errors.telemovel}
                helperText={errors.telemovel}
                fullWidth
                margin="normal"
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />

              <TextField
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                value={userData.dataNascimento}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                sx={{
                  mt: 3,
                  backgroundColor: "#000",
                  color: "#fff",
                  py: 1,
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Salvar
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Perfil;
