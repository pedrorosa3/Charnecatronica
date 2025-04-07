import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Alert } from "@mui/material";  // Certifique-se de importar o Alert
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const VenderPage = () => {
  const [formData, setFormData] = useState({
    preco: "",
    clienteid: "", // Inicializa com uma string vazia
    empregadoID: "",
    lojaNIPC: "", // Inicializa com uma string vazia
    equipamentoID: 1,
  });

  const [lojas, setLojas] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [clientes, setClientes] = useState([]);  // Estado para armazenar clientes

  // Buscar as lojas ao carregar a página
  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const response = await fetch("http://localhost:9000/lojas");
        const data = await response.json();
        setLojas(data);
        
        setFormData((prev) => ({ ...prev, lojaNIPC: "" }));
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
      }
    };

    fetchLojas();
  }, []);

  // Buscar empregados quando a loja é selecionada
  useEffect(() => {
    if (formData.lojaNIPC) {
      const fetchEmpregados = async () => {
        try {
          const response = await fetch(`http://localhost:9000/lojas/${formData.lojaNIPC}/empregados`);
          const data = await response.json();
          setEmpregados(data);
        } catch (error) {
          console.error("Erro ao buscar empregados:", error);
        }
      };

      fetchEmpregados();
    }
  }, [formData.lojaNIPC]);

  // Buscar clientes ao carregar a página
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:9000/clientes");  
        const data = await response.json();
        setClientes(data);
       
        setFormData((prev) => ({ ...prev, clienteid: "" }));
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [alertMessage, setAlertMessage] = useState("");  
  const [alertSeverity, setAlertSeverity] = useState("success"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:9000/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setAlertMessage("Compra registada com sucesso!");  // Mensagem de sucesso
        setAlertSeverity("success");  // Define como sucesso
        setFormData({
          preco: "",
          clienteid: "",
          empregadoID: "",
          lojaNIPC: "",
          equipamentoID: 1,
        });
      } else {
        const errorData = await response.json();
        setAlertMessage(`Erro: ${errorData.error}`);  // Mensagem de erro
        setAlertSeverity("error");  // Define como erro
      }
    } catch (error) {
      setAlertMessage("Erro ao conectar-se ao servidor.");
      setAlertSeverity("error");
    }
  };
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <Header />

      {/* Banner */}
      <Box sx={{ display: "flex", flexDirection: "row", height: "50vh", backgroundColor: "black" }}>
        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            Registo de Compra
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            Preencha os dados para registar uma compra.
          </Typography>
        </Box>
        <Box sx={{ width: "60%", display: "flex", justifyContent: "center", alignItems: "flex-start", backgroundColor: "black" }}>
          <Box
            sx={{
              width: "80%",
              height: "82.7%",
              backgroundImage: "url(/images/vendas.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
              borderTop: "80px solid black",
            }}
          />
        </Box>
      </Box>

      {/* Alert */}
      {alertMessage && (
        <Alert severity={alertSeverity} sx={{ mb: 2, mx: 2 }}>
          {alertMessage}
        </Alert>
      )}

      {/* Formulário */}
      <Box sx={{ display: "flex", flex: 1, paddingTop: "20px" }}>
        <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
          <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                Nova Compra
              </Typography>
              <form onSubmit={handleSubmit}>
                {/* Loja Select */}
                <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                  <InputLabel id="loja-select-label">Loja</InputLabel>
                  <Select
                    labelId="loja-select-label"
                    name="lojaNIPC"
                    value={formData.lojaNIPC || ""}
                    onChange={handleChange}
                    label="Loja"
                  >
                    {lojas.map((loja) => (
                      <MenuItem key={loja.nipc} value={loja.nipc}>
                        {loja.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Empregado Select */}
                <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                  <InputLabel id="empregado-select-label">Empregado</InputLabel>
                  <Select
                    labelId="empregado-select-label"
                    name="empregadoID"
                    value={formData.empregadoID}
                    onChange={handleChange}
                    label="Empregado"
                  >
                    {empregados.map((empregado) => (
                      <MenuItem key={empregado.id} value={empregado.id}>
                        {empregado.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Cliente Select */}
                <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                  <InputLabel id="cliente-select-label">Cliente</InputLabel>
                  <Select
                    labelId="cliente-select-label"
                    name="clienteid"
                    value={formData.clienteid || ""}
                    onChange={handleChange}
                    label="Cliente"
                  >
                    {clientes.map((cliente) => (
                      <MenuItem key={cliente.clienteid} value={cliente.clienteid}>
                        {cliente.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Equipamento ID */}
                <TextField
                  fullWidth
                  label="Equipamento ID"
                  name="equipamentoID"
                  type="number"
                  value={formData.equipamentoID}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                />

                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, backgroundColor: "#000", color: "#fff", py: 1, "&:hover": { backgroundColor: "#333" } }}
                >
                  Submeter Compra
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

export default VenderPage;











