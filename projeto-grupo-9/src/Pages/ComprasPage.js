import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

const VendasPage = () => {
  const [vendas, setVendas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [novoEstado, setNovoEstado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    try {
      const response = await fetch("http://localhost:9000/vendaslista");
      const data = await response.json();
      setVendas(data);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  };

  const abrirModal = (venda) => {
    setVendaSelecionada(venda);
    setNovoEstado(venda.estadovenda || "");
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setVendaSelecionada(null);
    setNovoEstado("");
  };

  const confirmarAlteracao = async () => {
    try {
      await fetch(`http://localhost:9000/vendaslista/${vendaSelecionada.numerovenda}/estado`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estadovenda: novoEstado }),
      });

      await fetchVendas();
      fecharModal();
    } catch (error) {
      console.error("Erro ao atualizar estado:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flex: 1, padding: "30px", mt: 12 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Vendas Realizadas
        </Typography>

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nº Venda</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Total da Compra (€)</TableCell>
                    <TableCell>Estado</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendas.length > 0 ? (
                    vendas.map((venda) => (
                      <TableRow key={venda.numerovenda}>
                        <TableCell>{venda.numerovenda}</TableCell>
                        <TableCell>
                          {venda.data
                            ? new Date(venda.data).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>{venda.clientenome || "—"}</TableCell>
                        <TableCell>
                          {venda.equipamentos && Array.isArray(venda.equipamentos)
                            ? venda.equipamentos
                                .reduce(
                                  (acc, eq) =>
                                    acc + Number(eq.precounitario || 0) * Number(eq.quantidade || 0),
                                  0
                                )
                                .toFixed(2)
                            : "0.00"}
                        </TableCell>
                        <TableCell>{venda.estadovenda || "—"}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "black", mr: 1 }}
                            onClick={() => abrirModal(venda)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "black" }}
                            onClick={() =>
                              navigate(`/equipamentosVendidos/${venda.numerovenda}`)
                            }
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhuma venda encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
      <Footer />

      {/* Modal de Edição */}
      <Modal open={modalOpen} onClose={fecharModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Alterar Estado da Venda
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={novoEstado}
              label="Estado"
              onChange={(e) => setNovoEstado(e.target.value)}
            >
              <MenuItem value="Entregue em loja física">Entregue em loja física</MenuItem>
              <MenuItem value="Pago">Pago</MenuItem>
              <MenuItem value="Enviado">Enviado</MenuItem>
              <MenuItem value="Entregue">Entregue</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "black" }}
              onClick={fecharModal}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "black" }}
              onClick={confirmarAlteracao}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default VendasPage;



