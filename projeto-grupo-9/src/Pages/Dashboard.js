import React from "react";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import Sidebar from "../Components/SideBarDashboard";

const Dashboard = () => {
  // Dados estáticos simulados
  const funcionario = {
    nome: "João Silva",
    numero: "EMP12345",
  };

  const dadosDashboard = {
    produtosStock: 320,
    reparacoes: 15,
    clientes: 87,
    projetosBeneficencia: 5,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        {/* Header do Funcionário */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: "#fafafa" }}>
          <Typography variant="h5" fontWeight="bold">
            Bem-vindo, {funcionario.nome}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Número do Funcionário: {funcionario.numero}
          </Typography>
        </Paper>

        {/* Grid de Estatísticas */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={6} sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Produtos em Stock
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {dadosDashboard.produtosStock}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={6} sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Reparações Ativas
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {dadosDashboard.reparacoes}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={6} sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Total de Clientes
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {dadosDashboard.clientes}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={6} sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Projetos de Beneficência
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {dadosDashboard.projetosBeneficencia}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
