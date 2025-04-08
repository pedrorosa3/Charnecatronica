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
  Alert,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const VenderPage = () => {
  const [formData, setFormData] = useState({
    preco: "",
    clienteid: "",
    empregadoID: "",
    lojaNIPC: "",
    estado: "",
    Cod_barras: "",
    marca: "",
    modelo: "",
  });

  const [lojas, setLojas] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

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

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const response = await fetch("http://localhost:9000/fichas");
        const data = await response.json();
        setEquipamentos(data);
        const marcasUnicas = [...new Set(data.map((e) => e.marca))];
        setMarcas(marcasUnicas);
      } catch (error) {
        console.error("Erro ao buscar fichas de equipamentos:", error);
      }
    };

    fetchEquipamentos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMarcaChange = (e) => {
    const marca = e.target.value;
    setFormData((prev) => ({
      ...prev,
      marca: marca,
      modelo: "",
      Cod_barras: "",
    }));

    const modelos = equipamentos.filter((e) => e.marca === marca);
    setModelosFiltrados(modelos);
  };

  const handleModeloChange = (e) => {
    const modeloSelecionado = e.target.value;
    setFormData((prev) => ({
      ...prev,
      modelo: modeloSelecionado,
      Cod_barras: "", // Não armazene o Cod_barras aqui
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.modelo) {
      setAlertMessage("Erro: O modelo é obrigatório.");
      setAlertSeverity("error");
      return;
    }

    try {
      // Envia apenas o modelo para o backend
      const response = await fetch("http://localhost:9000/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preco: formData.preco,
          clienteid: formData.clienteid,
          empregadoID: formData.empregadoID,
          lojaNIPC: formData.lojaNIPC,
          estado: formData.estado,
          modelo: formData.modelo,  // Apenas o modelo
        }),
      });

      if (response.ok) {
        setAlertMessage("Compra registada com sucesso!");
        setAlertSeverity("success");
        setFormData({
          preco: "",
          clienteid: "",
          empregadoID: "",
          lojaNIPC: "",
          estado: "",
          Cod_barras: "",  // Resetando o código de barras
          marca: "",
          modelo: "",  // Resetando o modelo
        });
      } else {
        const errorData = await response.json();
        setAlertMessage(`Erro: ${errorData.error}`);
        setAlertSeverity("error");
      }
    } catch (error) {
      setAlertMessage("Erro ao conectar-se ao servidor.");
      setAlertSeverity("error");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F8F8F8", marginTop: "100px" }}>
      <Header />

      {alertMessage && (
        <Alert severity={alertSeverity} sx={{ mb: 2, mx: 2 }}>
          {alertMessage}
        </Alert>
      )}

      <Box sx={{ display: "flex", flex: 1, paddingTop: "20px" }}>
        <Container maxWidth="md" sx={{ flex: 1, padding: "20px" }}>
          <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                Nova Compra
              </Typography>

              <form onSubmit={handleSubmit}>
                {/* Loja */}
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

                {/* Empregado */}
                <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                  <InputLabel id="empregado-select-label">Empregado</InputLabel>
                  <Select
                    labelId="empregado-select-label"
                    name="empregadoID"
                    value={formData.empregadoID}
                    onChange={handleChange}
                    label="Empregado"
                    disabled={!formData.lojaNIPC}
                  >
                    {empregados.map((empregado) => (
                      <MenuItem key={empregado.id} value={empregado.id}>
                        {empregado.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Cliente */}
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

                {/* Marca */}
                <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                  <InputLabel id="marca-select-label">Marca</InputLabel>
                  <Select
                    labelId="marca-select-label"
                    value={formData.marca || ""}
                    onChange={handleMarcaChange}
                    label="Marca"
                  >
                    {marcas.map((marca, index) => (
                      <MenuItem key={`${marca}-${index}`} value={marca}>
                        {marca}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Modelo */}
                <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                  <InputLabel id="modelo-select-label">Modelo</InputLabel>
                  <Select
                    labelId="modelo-select-label"
                    value={formData.modelo || ""}
                    onChange={handleModeloChange}
                    label="Modelo"
                    disabled={!formData.marca}
                  >
                    {modelosFiltrados.map((equip) => (
                      <MenuItem key={equip.Cod_barras} value={equip.modelo}>
                        {equip.modelo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Estado */}
                <FormControl fullWidth margin="normal" required sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px" }}>
                  <InputLabel id="estado-select-label">Estado do Equipamento</InputLabel>
                  <Select
                    labelId="estado-select-label"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    label="Estado do Equipamento"
                  >
                    <MenuItem value="Novo">Novo</MenuItem>
                    <MenuItem value="Como novo">Como novo</MenuItem>
                    <MenuItem value="Bom">Bom</MenuItem>
                    <MenuItem value="Aceitável">Aceitável</MenuItem>
                    <MenuItem value="Com defeito">Com defeito</MenuItem>
                  </Select>
                </FormControl>

                {/* Preço */}
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

















