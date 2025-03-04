import React from "react";
import { Container } from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const HomePage = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Container style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <h1>Bem-vindo à loja de eletrónica usada</h1>
        <p>Compre, venda, doe ou repare equipamentos eletrónicos usados de forma simples e rápida.</p>
      </Container>
      <Footer />
    </div>
  );
};

export default HomePage;
