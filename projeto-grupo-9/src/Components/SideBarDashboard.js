import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Build,
  Dashboard as DashboardIcon,
  Store,
  ShoppingCart,
  Storefront,
  Favorite,
  ListAlt,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  // Estado para abrir/fechar submenus
  const [openGestaoEquipamentos, setOpenGestaoEquipamentos] = useState(false);
  const [openLojaFisica, setOpenLojaFisica] = useState(false);

  const toggleEquipamentos = () => setOpenGestaoEquipamentos(!openGestaoEquipamentos);
  const toggleLojaFisica = () => setOpenLojaFisica(!openLojaFisica);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 250,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
      }}
    >
      <List>
        {/* Dashboard */}
        <ListItem button onClick={() => navigate("/dashboard")}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {/* Reparações */}
        <ListItem button onClick={() => navigate("/reparacoesEmpregado")}>
          <ListItemIcon><Build /></ListItemIcon>
          <ListItemText primary="Gestão de Reparações" />
        </ListItem>

        {/* Loja física */}
        <ListItem button onClick={toggleLojaFisica}>
          <ListItemIcon><Store /></ListItemIcon>
          <ListItemText primary="Loja Física" />
          {openLojaFisica ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openLojaFisica} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItem button onClick={() => navigate("/equipamentosVendidos")}>
              <ListItemIcon><ShoppingCart /></ListItemIcon>
              <ListItemText primary="Realizar Venda" />
            </ListItem>
            <ListItem button onClick={() => navigate("/comprarAoCliente")}>
              <ListItemIcon><Storefront /></ListItemIcon>
              <ListItemText primary="Realizar Compra" />
            </ListItem>
          </List>
        </Collapse>

        {/* Equipamentos */}
        <ListItem button onClick={toggleEquipamentos}>
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary="Gestão de Equipamentos" />
          {openGestaoEquipamentos ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openGestaoEquipamentos} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItem button onClick={() => navigate("/equipamentosVendidos")}>
              <ListItemText primary="Equipamentos Vendidos" />
            </ListItem>
            <ListItem button onClick={() => navigate("/equipamentoscomprados")}>
              <ListItemText primary="Equipamentos Comprados" />
            </ListItem>
            <ListItem button onClick={() => navigate("/fichas-equipamentos")}>
              <ListItemText primary="Fichas de Equipamentos" />
            </ListItem>
            <ListItem button onClick={() => navigate("/criarFichaEquipamento")}>
              <ListItemText primary="Criar Nova Ficha" />
            </ListItem>
          </List>
        </Collapse>

        <Divider sx={{ my: 2 }} />

        {/* Outras gestões */}
        <ListItem button onClick={() => navigate("/lojas")}>
          <ListItemIcon><Store /></ListItemIcon>
          <ListItemText primary="Gestão das Lojas" />
        </ListItem>

        <ListItem button onClick={() => navigate("/doarFuncionario")}>
          <ListItemIcon><Favorite /></ListItemIcon>
          <ListItemText primary="Projetos de Beneficência" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
