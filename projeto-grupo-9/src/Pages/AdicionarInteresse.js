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
import Header from "../Components/Header";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const AdicionarInteressePage = () => {
    const { user, } = useAuth0();
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
        body: JSON.stringify({
          email: user?.email,
          marca: formData.marca,
          modelo: formData.modelo,
        }),
      });

      if (res.ok) {
        showSnackbar("Interesse adicionado com sucesso!");
        setFormData({ marca: "", modelo: "" });
        setModelosFiltrados([]);
        setTimeout(() => {
          navigate("/interesses");
        }, 1500);
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
    
    <Box sx={{ display: "flex", flex: 1, mt: 12 }}>
      <Header />
      {/* Sidebar */}
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

      {/* Formulário */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          mt: 12,
        }}
      >
        <Container maxWidth="sm">
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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


