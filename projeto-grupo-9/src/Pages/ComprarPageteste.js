import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Rating,
  Chip,
  TextField,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SidebarComprar from "../Components/SidebarComprar";

const ComprarPageteste = () => {
  const [equipamentos, setEquipamentos] = useState([]); // Estado para armazenar produtos
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [preco, setPreco] = useState([0, 2000]);
  const [selectedOfertas, setSelectedOfertas] = useState([]);

  // 🚀 Buscar produtos do backend
  useEffect(() => {
    fetch("http://localhost:9000/equipamentos")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Verifique se os dados estão corretos
        setEquipamentos(data);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  // Filtragem dos produtos
  const produtosFiltrados = equipamentos.filter((produto) => {
    const precoNumerico = parseFloat(produto.preco);
    const categoriaMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(produto.categoria);
    const precoMatch = precoNumerico >= preco[0] && precoNumerico <= preco[1];

    return categoriaMatch && precoMatch;
  });

  // Estado para adicionar produtos via formulário
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoria: "",
    preco: "",
    avaliacao: "",
    reviews: "",
    imagem: "",
  });

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    setNovoProduto({ ...novoProduto, [e.target.name]: e.target.value });
  };

  // Função para adicionar um novo produto
  const adicionarProduto = () => {
    fetch("http://localhost:9000/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoProduto),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setNovoProduto({ nome: "", categoria: "", preco: "", avaliacao: "", reviews: "", imagem: "" });
        // Atualizar a lista de produtos após inserção
        fetch("http://localhost:9000/equipamentos")
          .then((res) => res.json())
          .then((data) => setEquipamentos(data));
      })
      .catch((err) => console.error("Erro ao adicionar produto:", err));
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

      <Box sx={{ display: "flex", flex: 1, paddingTop: "80px" }}>
        {/* Sidebar */}
        <SidebarComprar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          preco={preco}
          setPreco={setPreco}
          selectedOfertas={selectedOfertas}
          setSelectedOfertas={setSelectedOfertas}
        />

        {/* Grid de Produtos */}
        <Box sx={{ flex: 1, padding: "20px" }}>
          {/* Formulário para adicionar produtos */}
          <Box sx={{ marginBottom: "20px", padding: "10px", backgroundColor: "#fff", borderRadius: "10px" }}>
            <Typography variant="h6">Adicionar Novo Produto</Typography>
            <TextField label="Nome" name="nome" value={novoProduto.nome} onChange={handleChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Categoria" name="categoria" value={novoProduto.categoria} onChange={handleChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Preço (€)" name="preco" type="number" value={novoProduto.preco} onChange={handleChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Avaliação (0-5)" name="avaliacao" type="number" step="0.1" value={novoProduto.avaliacao} onChange={handleChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Reviews" name="reviews" value={novoProduto.reviews} onChange={handleChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Imagem (URL)" name="imagem" value={novoProduto.imagem} onChange={handleChange} fullWidth sx={{ marginBottom: 1 }} />
            <Button variant="contained" onClick={adicionarProduto} sx={{ backgroundColor: "#000", color: "#FFF" }}>
              Adicionar Produto
            </Button>
          </Box>

          {/* Exibir produtos filtrados */}
          {produtosFiltrados.length === 0 ? (
            <Typography variant="h6" textAlign="center" sx={{ mt: 5, color: "#000" }}>
              Nenhum produto encontrado com os filtros selecionados.
            </Typography>
          ) : (
            <Grid container spacing={3} sx={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
              {produtosFiltrados.map((produto, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ backgroundColor: "#FFFFFF", borderRadius: "15px", padding: "20px", textAlign: "center", position: "relative" }}>
                    <Box sx={{ position: "absolute", top: "10px", right: "10px" }}>
                      <Chip label={produto.categoria} variant="outlined" sx={{ backgroundColor: "#F5F5F5", color: "#000", fontSize: "12px" }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <img src={produto.imagem} alt={produto.nome} style={{ width: "150px", height: "150px", objectFit: "contain" }} />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{produto.nome}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1, mb: 1 }}>
                        <Rating value={produto.avaliacao} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1, color: "gray" }}>{produto.reviews}</Typography>
                      </Box>
                      <Typography variant="h6">{produto.preco}€</Typography>
                      <Button variant="contained" fullWidth sx={{ backgroundColor: "#000", color: "#FFFFFF", borderRadius: "50px", textTransform: "none", fontWeight: "bold", marginTop: "15px", "&:hover": { backgroundColor: "#333" } }}>
                        Adicionar ao Carrinho
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ComprarPageteste;
