import React, { useState, useEffect } from "react";
import {
  Avatar,  
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const AdicionarInteressePage = () => {
    const { user, isLoading } = useAuth0();
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    
    marca: "",
    modelo: "",
    
  });

 
  const [equipamentos, setEquipamentos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (msg, severity = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    

    const fetchEquipamentos = async () => {
      try {
        const res = await fetch("http://localhost:9000/fichas");
        const data = await res.json();
        setEquipamentos(data);
        const marcasUnicas = [...new Set(data.map((e) => e.marca))];
        setMarcas(marcasUnicas);
      } catch (err) {
        console.error("Erro ao buscar fichas:", err);
      }
    };

    
    fetchEquipamentos();
  }, []);

  const handleSubmit = async () => {
    if (!formData.marca || !formData.modelo) {
      showSnackbar("Preenche todos os campos obrigatórios.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:9000/interesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showSnackbar("Interesse adicionado com sucesso!");
        setFormData({ marca: "", modelo: "" });
        setModelosFiltrados([]);
      } else {
        const err = await res.json();
        showSnackbar(`Erro: ${err.error || "Erro ao adicionar interesse."}`, "error");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      showSnackbar("Erro ao conectar com o servidor.", "error");
    }
  };

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
      </Box>

      <Box sx={{ display: "flex", flex: 1, paddingTop: "20px" }}>
        <Container maxWidth="sm" sx={{ flex: 1 }}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "10px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                Adicionar Interesse
              </Typography>

              <form onSubmit={(e) => e.preventDefault()}>
                

                <Autocomplete
                  options={marcas}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) => {
                    setFormData((prev) => ({ ...prev, marca: value || "", modelo: "" }));
                    const modelos = equipamentos.filter((e) => e.marca === value);
                    setModelosFiltrados(modelos);
                  }}
                  value={formData.marca || null}
                  renderInput={(params) => <TextField {...params} label="Marca" required />}
                  sx={{ mt: 2 }}
                />

                <Autocomplete
                  options={modelosFiltrados}
                  getOptionLabel={(option) => option.modelo}
                  onChange={(e, value) =>
                    setFormData((prev) => ({ ...prev, modelo: value?.modelo || "" }))
                  }
                  value={
                    modelosFiltrados.find((m) => m.modelo === formData.modelo) || null
                  }
                  renderInput={(params) => <TextField {...params} label="Modelo" required />}
                  sx={{ mt: 2 }}
                  disabled={!formData.marca}
                />

                

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
                  onClick={handleSubmit}
                >
                  Submeter Interesse
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50px",
          bgcolor: "#222",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1500,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Footer />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdicionarInteressePage;


