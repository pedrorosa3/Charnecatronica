// src/pages/LoginEmpregado.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

const LoginEmpregado = () => {
  const navigate = useNavigate();
  const [numInterno, setNumInterno] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumInternoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      setNumInterno(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {

      const response = await fetch("http://localhost:9000/api/loginempregado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numInterno,
          password: senha,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar os dados localmente
        localStorage.setItem("authEmpregado", "true");
        localStorage.setItem("empregadoNome", data.nome);
        localStorage.setItem("empregadoNumero", data.numInterno);
        navigate("/dashboard");
      } else {
        setErro(data.message || "Erro ao fazer login.");
      }
    } catch (err) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2} fontWeight="bold" textAlign="center">
          Login do Empregado
        </Typography>

        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Número do Empregado"
            variant="outlined"
            fullWidth
            margin="normal"
            value={numInterno}
            onChange={handleNumInternoChange}
            required
            inputProps={{ maxLength: 9 }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Entrar"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginEmpregado;
