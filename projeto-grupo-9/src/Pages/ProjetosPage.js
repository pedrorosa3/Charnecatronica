import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
  Button,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SidebarComprar from "../Components/SidebarComprar";

// Estilo para o botão de upload de imagem
const Input = styled("input")({
  display: "none",
});

const ProjetosPage = () => {
  // Dados dos projetos de beneficiencia 
  const projetos = [
    {
      id: 1,
      title: "Doação de Computadores para Escolas e Instituições Carenciadas",
      description: "A loja pode recolher computadores usados, recondicioná-los e doá-los para escolas, bibliotecas ou centros comunitários que atendem crianças e jovens de baixa renda. Isso ajuda a reduzir a exclusão digital e a fornecer acesso à tecnologia para fins educacionais.",
      imagem: "/images/Instituicao-ensino.jpg", 
    },
    {
      id: 2,
      title: "Recolha e Reciclagem de Resíduos Eletrônicos",
      description: " A loja pode criar um ponto de recolha de equipamentos eletrônicos antigos (teclados, monitores, baterias, etc.), garantindo que sejam reciclados de forma ambientalmente responsável. Parte dos equipamentos pode ser recondicionada e doada.",
      imagem: "/images/residuos-eletronicos.jpg", 
    },
    {
      id: 3,
      title: "Projeto C",
      description: "Descrição breve do projeto C",
      imagem: "https://via.placeholder.com/300", 
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
      }}
    >
      <Header /> {/* Cabeçalho */}
      
      <Container sx={{ flex: 1, paddingTop: "80px", paddingBottom: "40px" }}>
        {/* Título da seção */}
        <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: 600 }}>
          Projetos de Beneficência
        </Typography>

        {/* Grid de cards */}
        <Grid container spacing={4}>
          {projetos.map((projeto) => (
            <Grid item xs={12} sm={6} md={4} key={projeto.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={projeto.imagem}
                  alt={projeto.title}
                />
                <CardContent>
                  <Typography variant="h6">{projeto.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {projeto.description}
                  </Typography>
                    {/* Botão detalhes  */}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                        backgroundColor: "#000",
                        color: "#FFFFFF",
                        borderRadius: "50px",
                        textTransform: "none",
                        fontWeight: "bold",
                        marginTop: "15px",
                        "&:hover": {
                            backgroundColor: "#333",
                        },
                        }}
                    >
                        Mais detalhes
                    </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer /> {/* Rodapé */}
    </Box>
  );
};

export default ProjetosPage;
