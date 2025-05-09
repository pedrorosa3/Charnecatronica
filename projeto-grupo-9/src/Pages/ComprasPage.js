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

const VendasPage = () => {
  const [vendas, setVendas] = useState([]);
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
                    <TableCell></TableCell>
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
                        <TableCell>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "black",
                              "&:hover": { backgroundColor: "#333" },
                            }}
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
    </Box>
  );
};

export default VendasPage;


