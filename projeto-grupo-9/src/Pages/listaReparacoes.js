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

const ListaReparacoes = () => {
  const [reparacoes, setReparacoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReparacoes();
  }, []);

  const fetchReparacoes = async () => {
    try {
      const response = await fetch("http://localhost:9000/reparacoes/lista");
      const data = await response.json();
      setReparacoes(data);
    } catch (error) {
      console.error("Erro ao buscar reparações:", error);
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
          Lista de Reparações
        </Typography>
        <Card sx={{ padding: "20px" }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Produto</TableCell>
                    <TableCell>Loja</TableCell>
                    <TableCell>Empregado</TableCell>
                    <TableCell>Data de Receção</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(reparacoes) && reparacoes.length > 0 ? (
                    reparacoes.map((rep) => (
                      <TableRow key={rep.id}>
                        <TableCell>{rep.id}</TableCell>
                        <TableCell>
                          {rep.produto || `${rep.marca} ${rep.modelo}`}
                        </TableCell>
                        <TableCell>{rep.lojanome}</TableCell>
                        <TableCell>{rep.empregadonome}</TableCell>
                        <TableCell>
                          {rep.datarececaoequipamento &&
                            new Date(
                              rep.datarececaoequipamento
                            ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{rep.estado}</TableCell>
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
                            onClick={() => navigate(`/reparacoes/${rep.id}`)}
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Não existem reparações registadas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#333" },
                  borderRadius: "8px",
                  paddingX: 3,
                  paddingY: 1,
                }}
                onClick={() => navigate("/reparacoesEmpregado")}
              >
                Registar Reparação
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default ListaReparacoes;
