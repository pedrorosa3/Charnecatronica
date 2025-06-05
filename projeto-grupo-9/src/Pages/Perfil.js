import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Avatar,
  Card,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  MenuItem,
  Snackbar,    // <-- importei Snackbar
  Alert,       // <-- importei Alert
} from "@mui/material";
import {
  VolunteerActivism,
  RequestQuote,
} from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const Perfil = () => {
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();

  const [encomendas, setEncomendas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState({
    nome: user?.name || "",
    email: user?.email || "",
    nif: "",
    nic: "",
    genero: "",
    telemovel: "",
    dataNascimento: "",
  });

  // Estado para Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1, paddingTop: "80px" }}>
        {/* Lado esquerdo com perfil */}
        <Box
          sx={{
            width: "280px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h6">{user?.name}</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {user?.nickname}
          </Typography>
          <Typography variant="body2">Tipo de Utilizador:</Typography>
          <Typography variant="caption" color="textSecondary">
            Comprador
          </Typography>

          <Typography variant="body2">NIF:</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {userData.nif}
          </Typography>
          <Typography variant="body2">NIC:</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {userData.nic}
          </Typography>
          <Typography variant="body2">Género:</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {userData.genero}
          </Typography>
          <Typography variant="body2">Telemóvel:</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {userData.telemovel}
          </Typography>
          <Typography variant="body2">Nascimento:</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {userData.dataNascimento}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenModal(true)}
            sx={{ mt: 2, borderColor: "#000", color: "#000" }}
          >
            Editar dados de utilizador
          </Button>
        </Box>

        {/* Lado direito com opções e histórico */}
        <Container sx={{ flex: 1, padding: "30px" }}>
          <Grid container spacing={2} justifyContent="center">
            {/* Botão de Doações */}
            <Grid item xs={12} md={5}>
              <Card
                onClick={() => navigate("/vendaspage")}
                sx={{
                  padding: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  border: "2px solid #000",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
              >
                <VolunteerActivism fontSize="large" />
                <Typography variant="h6" mt={2}>
                  Doações
                </Typography>
              </Card>
            </Grid>

            {/* Botão de Reparações */}
            <Grid item xs={12} md={5}>
              <Card
                onClick={() => navigate(`/avarias?email=${user.email}`)}
                sx={{
                  padding: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  border: "2px solid #000",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
              >
                <RequestQuote fontSize="large" />
                <Typography variant="h6" mt={2}>
                  Reparações
                </Typography>
              </Card>
            </Grid>

            {/* Histórico de encomendas */}
            <Grid item xs={12} mt={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Histórico de encomendas:
              </Typography>

              {encomendas.length === 0 ? (
                <Typography>Ainda sem encomendas realizadas.</Typography>
              ) : (
                encomendas.map((enc) => (
                  <Card key={enc.id} sx={{ marginBottom: 3, padding: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography>
                        Encomenda feita:{" "}
                        {new Date(enc.data_encomenda).toLocaleDateString()}
                      </Typography>
                      <Typography>Total: {enc.total.toFixed(2)}€</Typography>
                      <Typography>Destinatário: {enc.destinatario}</Typography>
                      <Typography>Encomenda # {enc.numero_encomenda}</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      {enc.imagem && (
                        <img
                          src={enc.imagem}
                          alt="Produto"
                          style={{ width: 100, height: 100, marginRight: 20, objectFit: "cover" }}
                        />
                      )}
                      <Box>
                        <Typography fontWeight="bold">{enc.produto}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Entregue em:{" "}
                          {new Date(enc.data_entrega).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Devolução até:{" "}
                          {new Date(
                            new Date(enc.data_entrega).setMonth(
                              new Date(enc.data_entrega).getMonth() + 1
                            )
                          ).toLocaleDateString()}
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                          <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                            Comprar novamente
                          </Button>
                          <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                            Ver produtos
                          </Button>
                          <Button variant="outlined" size="small">
                            Seguir encomenda
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Modal para editar dados do utilizador */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">Editar dados do utilizador</Typography>

          <TextField label="Email" value={userData.email} disabled fullWidth />

          <TextField
            label="Nome"
            value={userData.nome}
            onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
            fullWidth
          />

          <TextField
            label="NIF"
            inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*" }}
            value={userData.nif}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setUserData({ ...userData, nif: onlyNums });
            }}
            fullWidth
          />

          <TextField
            label="NIC"
            inputProps={{ maxLength: 8, inputMode: "numeric", pattern: "[0-9]*" }}
            value={userData.nic}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setUserData({ ...userData, nic: onlyNums });
            }}
            fullWidth
          />

          <TextField
            label="Género"
            select
            value={userData.genero}
            onChange={(e) => setUserData({ ...userData, genero: e.target.value })}
            fullWidth
          >
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Feminino">Feminino</MenuItem>
            <MenuItem value="Outro">Outro</MenuItem>
          </TextField>

          <TextField
            label="Telemóvel"
            inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*" }}
            value={userData.telemovel}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setUserData({ ...userData, telemovel: onlyNums });
            }}
            fullWidth
          />

          <TextField
            label="Data de Nascimento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={userData.dataNascimento}
            onChange={(e) => setUserData({ ...userData, dataNascimento: e.target.value })}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={async () => {
              try {
                const response = await fetch("http://localhost:9000/perfil", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userData),
                });

                const result = await response.json();

                if (!response.ok) {
                  // Substitui alert por Snackbar
                  setSnackbar({
                    open: true,
                    message: result.error || "Erro ao guardar os dados.",
                    severity: "error",
                  });
                  return;
                }

                setSnackbar({
                  open: true,
                  message: result.message || "Perfil guardado com sucesso!",
                  severity: "success",
                });
                setOpenModal(false);
              } catch (error) {
                console.error("Erro ao enviar dados do perfil:", error);
                // Substitui alert por Snackbar
                setSnackbar({
                  open: true,
                  message: "Erro ao comunicar com o servidor.",
                  severity: "error",
                });
              }
            }}
          >
            Guardar alterações
          </Button>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default Perfil;
