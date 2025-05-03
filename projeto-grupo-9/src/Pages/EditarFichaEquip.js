import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Autocomplete,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const EditarFichaEquip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    tipo: "",
    precoBase: "",
    anoLancamento: "",
  });

  const [tipos, setTipos] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState("success");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    // Buscar dados da ficha
    fetch(`http://localhost:9000/fichas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          marca: data.marca,
          modelo: data.modelo,
          tipo: data.tipo,
          precoBase: data.precobase,
          anoLancamento: data.anolancamento,
        });
      })
      .catch((err) => {
        console.error("Erro ao carregar ficha:", err);
        setMensagem("Erro ao carregar ficha.");
        setTipoMensagem("error");
      });

    // Buscar tipos de equipamento
    fetch("http://localhost:9000/fichas/tipos")
      .then((res) => res.json())
      .then((data) => setTipos(data))
      .catch((err) => {
        console.error("Erro ao carregar tipos:", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const apenasNumeros = value.replace(/\D/g, "");
    if (name === "precoBase" || name === "anoLancamento") {
      setFormData((prev) => ({ ...prev, [name]: apenasNumeros }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:9000/fichas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMensagem("Ficha atualizada com sucesso.");
        setTipoMensagem("success");
        setConfirmDialogOpen(false);
        setTimeout(() => navigate(`/ficha/${id}`), 1000);
      } else {
        setMensagem("Erro ao atualizar ficha.");
        setTipoMensagem("error");
      }
    } catch (error) {
      console.error("Erro ao editar ficha:", error);
      setMensagem("Erro ao comunicar com o servidor.");
      setTipoMensagem("error");
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 15 }}>
        <Typography variant="h4" gutterBottom>
          Editar Ficha de Equipamento
        </Typography>

        {mensagem && (
          <Alert
            severity={tipoMensagem}
            sx={{ mb: 2 }}
            onClose={() => setMensagem(null)}
          >
            {mensagem}
          </Alert>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            label="Marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Autocomplete
            options={tipos}
            getOptionLabel={(option) => option}
            onChange={(e, value) =>
              setFormData((prev) => ({ ...prev, tipo: value || "" }))
            }
            value={formData.tipo || ""}
            renderInput={(params) => (
              <TextField {...params} label="Tipo" required margin="normal" />
            )}
            disableClearable
            disablePortal
            freeSolo={false}
          />
          <TextField
            fullWidth
            label="Preço base de referência (€)"
            name="precoBase"
            type="number"
            value={formData.precoBase}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            fullWidth
            label="Ano de Lançamento"
            name="anoLancamento"
            type="number"
            value={formData.anoLancamento}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "black",
              "&:hover": { backgroundColor: "#333" },
            }}
            onClick={() => setConfirmDialogOpen(true)}
          >
            Confirmar
          </Button>
        </form>
      </Container>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmar Edição</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja editar a ficha de equipamento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleEdit} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditarFichaEquip;
