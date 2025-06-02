import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Autocomplete,
  Alert,
} from "@mui/material";
import Header from "../Components/Header";

const CriarFichaEquip = () => {
  const [formData, setFormData] = useState({
    codBarras: "",
    marca: "",
    modelo: "",
    tipo: "",
    precoBase: "",
    anoLancamento: "",
  });

  const [tipos, setTipos] = useState([]);
  const [codBarrasErro, setCodBarrasErro] = useState(false);
  const [mensagem, setMensagem] = useState(null); // texto do alerta
  const [tipoMensagem, setTipoMensagem] = useState("success"); // 'error' ou 'success'

  useEffect(() => {
    fetch("http://localhost:9000/fichas/tipos")
      .then((res) => res.json())
      .then((data) => setTipos(data))
      .catch((err) => {
        console.error("Erro ao carregar tipos:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const apenasNumeros = value.replace(/\D/g, "");
    if (name === "precoBase" || name === "anoLancamento") {
      setFormData((prev) => ({
        ...prev,
        [name]: apenasNumeros,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validarCampos = () => {
    const camposVazios = Object.entries(formData)
      .filter(([_, valor]) => valor === "")
      .map(([campo]) => campo);

    const codBarrasValido = /^\d{13}$/.test(formData.codBarras);
    setCodBarrasErro(!codBarrasValido);

    return { camposVazios, codBarrasValido };
  };

  const handleSubmit = async () => {
    const { camposVazios, codBarrasValido } = validarCampos();

    if (camposVazios.length > 0) {
      setMensagem(
        `Campos por preencher: ${camposVazios
          .map((c) => traduzCampo(c))
          .join(", ")}`
      );
      setTipoMensagem("error");
      return;
    }

    if (!codBarrasValido) {
      setMensagem(
        "O código de barras deve ter exatamente 13 dígitos numéricos."
      );
      setTipoMensagem("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/fichas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMensagem("Ficha criada com sucesso!");
        setTipoMensagem("success");
        setFormData({
          codBarras: "",
          marca: "",
          modelo: "",
          tipo: "",
          precoBase: "",
          anoLancamento: "",
        });
        setCodBarrasErro(false);
      } else {
        setMensagem("Erro ao criar ficha.");
        setTipoMensagem("error");
      }
    } catch (err) {
      console.error("Erro ao submeter ficha:", err);
      setMensagem("Erro de ligação ao servidor.");
      setTipoMensagem("error");
    }
  };

  const traduzCampo = (campo) => {
    const mapa = {
      codBarras: "Código de Barras",
      marca: "Marca",
      modelo: "Modelo",
      tipo: "Tipo",
      precoBase: "Preço Base",
      anoLancamento: "Ano de Lançamento",
    };
    return mapa[campo] || campo;
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 15 }}>
        <Typography variant="h4" gutterBottom>
          Criar Ficha de Equipamento
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
            label="Código de Barras"
            name="codBarras"
            value={formData.codBarras}
            onChange={(e) => {
              const apenasNumeros = e.target.value.replace(/\D/g, "");
              if (apenasNumeros.length <= 13) {
                setFormData((prev) => ({
                  ...prev,
                  codBarras: apenasNumeros,
                }));
              }
            }}
            margin="normal"
            required
            error={codBarrasErro}
            helperText={
              codBarrasErro
                ? "O código deve ter exatamente 13 dígitos numéricos."
                : ""
            }
            inputProps={{
              maxLength: 13,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
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
            value={formData.tipo || null}
            renderInput={(params) => (
              <TextField {...params} label="Tipo" required margin="normal" />
            )}
            disableClearable
            disablePortal
            freeSolo={false}
            sx={{ mt: 2 }}
            isOptionEqualToValue={(option, value) => option === value}
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
            onClick={handleSubmit}
          >
            Submeter Ficha
          </Button>
        </form>
      </Container>
    </>
  );
};

export default CriarFichaEquip;
