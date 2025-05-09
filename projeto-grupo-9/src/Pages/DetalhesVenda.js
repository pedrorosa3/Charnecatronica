import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const DetalhesVendaPage = () => {
  const { numerovenda } = useParams(); // <-- pegando o parâmetro corretamente em minúsculas
  const [venda, setVenda] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetalhesVenda();
  }, [numerovenda]);

  const fetchDetalhesVenda = async () => {
    try {
      const response = await fetch(`http://localhost:9000/vendaslista/${numerovenda}`);
      const data = await response.json();
      setVenda(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da venda:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ flex: 1, padding: "30px", mt: 12 }}>
        {venda ? (
          <>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Detalhes da Venda #{venda.numerovenda}
            </Typography>

            <Card sx={{ marginBottom: "20px" }}>
              <CardContent>
                <Typography variant="h6">Informações da Venda</Typography>
                <Typography>Data: {new Date(venda.datavenda).toLocaleDateString()}</Typography>
                <Typography>Tipo: {venda.tipo}</Typography>
                <Typography>Custo de Transporte (€): {venda.custotransporte}</Typography>
                <Typography>Cliente: {venda.clientenome}</Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">Equipamentos Vendidos</Typography>
                {venda.equipamentos.map((equipamento, index) => (
                  <Box key={equipamento.id} sx={{ marginBottom: "15px" }}>
                    <Typography>Equipamento {index + 1}:</Typography>
                    <Typography>Marca: {equipamento.marca}</Typography>
                    <Typography>Modelo: {equipamento.modelo}</Typography>
                    <Typography>Preço Unitário (€): {equipamento.precounitario}</Typography>
                    <Typography>Quantidade: {equipamento.quantidade}</Typography>
                    <Typography>
                      Preço Total (€): {(equipamento.precounitario * equipamento.quantidade).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <Typography variant="h6" align="center">
            Carregando detalhes da venda...
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": { backgroundColor: "#333" },
            borderRadius: "8px",
            paddingX: 3,
            paddingY: 1,
            marginTop: "20px",
          }}
          onClick={() => navigate("/vendas")}
        >
          Voltar
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default DetalhesVendaPage;


