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
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

const ComprasPage = () => {
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await fetch("http://localhost:9000/compraslista");
      const data = await response.json();
      setCompras(data);
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
      }}
    >
      <Header />
      <Container sx={{ flex: 1, padding: "30px", mt: 12 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", marginBottom: "30px" }}
        >
          Equipamentos comprados a clientes
        </Typography>
        <Card sx={{ padding: "20px" }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Preço (€)</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Empregado</TableCell>
                    <TableCell>Loja</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Modelo</TableCell>
                    <TableCell></TableCell> {/* NOVA COLUNA */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(compras) && compras.length > 0 ? (
                    compras.map((compra) => (
                      <TableRow key={compra.id}>
                        <TableCell>{compra.id}</TableCell>
                        <TableCell>{compra.estadocompra}</TableCell>
                        <TableCell>
                          {new Date(compra.data).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{compra.preco.toFixed(2)}</TableCell>
                        <TableCell>{compra.clientenome}</TableCell>
                        <TableCell>{compra.empregadonome}</TableCell>
                        <TableCell>{compra.lojanome}</TableCell>
                        <TableCell>{compra.equipamentomarca}</TableCell>
                        <TableCell>{compra.equipamentomodelo}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#000",
                              color: "#fff",
                              "&:hover": { backgroundColor: "#333" },
                              borderRadius: "8px",
                              paddingX: 2,
                              paddingY: 0.5,
                              fontSize: "0.875rem",
                              textTransform: "none",
                            }}
                            onClick={() =>
                              navigate(`/equipamentosComprados/${compra.id}`)
                            }
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        Não existem compras realizadas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ✅ Botão único no canto inferior direito */}
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#333" }, // efeito hover suave
                  borderRadius: "8px",
                  paddingX: 3,
                  paddingY: 1,
                }}
                onClick={() => navigate("/comprarAoCliente")}
              >
                Adicionar Compra
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default ComprasPage;
