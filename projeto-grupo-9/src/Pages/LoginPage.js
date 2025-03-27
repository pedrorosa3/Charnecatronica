import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // Para armazenar erros
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Enviar os dados para o backend
      try {
        const response = await fetch('http://localhost:9000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // Se houver um erro de autenticação, mostrar mensagem
          setError(data.message || 'Falha no login. Tente novamente.');
        } else {
          // Se o login for bem-sucedido, redirecionar o usuário ou atualizar o estado
          console.log('Login bem-sucedido:', data);
          // Redirecionar ou armazenar o token de autenticação
        }
      } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        setError('Ocorreu um erro. Tente novamente mais tarde.');
      }
    };
  
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box flex="1" display="flex" justifyContent="center" alignItems="center">
          <Container maxWidth="sm">
            <Card sx={{ width: "100%", padding: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Login
                </Typography>
                {error && (
                  <Typography variant="body2" color="error" gutterBottom>
                    {error}
                  </Typography>
                )}
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  >
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  };
  
  export default LoginPage;
  
