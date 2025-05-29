import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Header from "../Components/Header";

const AdicionarLoja = () => {
  const [lojas, setLojas] = useState([
    {
      nome: "Loja Exemplo",
      morada: "Rua das Flores, 123",
      telefone: "912345678",
      horario: "09:00 - 18:00",
      posicao: {
        lat: 38.7169,
        lng: -9.1399,
      },
    },
  ]);
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const [novaLoja, setNovaLoja] = useState({
    nome: "",
    telefone: "",
    email: "",
    morada: {
      pais: "Portugal",
      localidade: "",
      latitude: null,
      longitude: null,
      freguesia: "",
      rua: "",
      codigopostal: "",
      concelho: "",
      numero: "",
      distrito: "",
    },
  });

  const mapRef = useRef(null);
  const mapa = useRef(null);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    mapa.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 38.6275, lng: -9.1853 },
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!mapa.current) return;
    desenharMarcadores(lojas);
  }, [lojas]);

  useEffect(() => {
    if (inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const getComp = (type) => {
            const comp = place.address_components?.find(c => c.types.includes(type));
            return comp ? comp.long_name : "";
          };

          const morada = {
            rua: getComp("route") || place.name || "",
            numero: getComp("street_number"),
            localidade: getComp("locality"),
            freguesia: getComp("sublocality") || getComp("administrative_area_level_2"),
            concelho: getComp("administrative_area_level_2"),
            distrito: getComp("administrative_area_level_1"),
            codigopostal: getComp("postal_code"),
            pais: getComp("country"),
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };

          setNovaLoja((prev) => ({ ...prev, morada }));
        }
      });
    }
  }, []);

  const desenharMarcadores = (lista) => {
    lista.forEach((loja) => {
      const marker = new window.google.maps.Marker({
        position: loja.posicao,
        map: mapa.current,
        title: loja.nome,
      });

      const info = new window.google.maps.InfoWindow({
        content: `
          <div>
            <strong>${loja.nome}</strong><br/>
            ${loja.morada}<br/>
            ${loja.telefone}
          </div>
        `,
      });

      marker.addListener("click", () => {
        info.open(mapa.current, marker);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novaLoja.morada.latitude || !novaLoja.morada.longitude) {
      setMensagem("Por favor selecione uma morada válida.");
      setTipoMensagem("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:9000/lojas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novaLoja.nome,
          numerotelefone: novaLoja.telefone,
          email: novaLoja.email,
          morada: novaLoja.morada,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao criar loja: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      setLojas([
        ...lojas,
        {
          nome: novaLoja.nome,
          morada: `${novaLoja.morada.rua}, ${novaLoja.morada.localidade}`,
          telefone: novaLoja.telefone,
          horario: "A definir",
          posicao: {
            lat: novaLoja.morada.latitude,
            lng: novaLoja.morada.longitude,
          },
        },
      ]);

      setNovaLoja({
        nome: "",
        telefone: "",
        email: "",
        morada: {
          pais: "Portugal",
          localidade: "",
          latitude: null,
          longitude: null,
          freguesia: "",
          rua: "",
          codigopostal: "",
          concelho: "",
          numero: "",
          distrito: "",
        },
      });

      setMensagem("Loja criada com sucesso!");
      setTipoMensagem("success");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao criar loja.");
      setTipoMensagem("error");
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 12 }}>
        <Typography variant="h4" gutterBottom>
          Adicionar Loja
        </Typography>

        {mensagem && (
          <Alert
            severity={tipoMensagem}
            onClose={() => setMensagem(null)}
            sx={{ mb: 2 }}
          >
            {mensagem}
          </Alert>
        )}

        <Box
          ref={mapRef}
          sx={{
            width: "100%",
            height: 400,
            borderRadius: 2,
            mb: 4,
          }}
        />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome da Loja"
            value={novaLoja.nome}
            onChange={(e) => setNovaLoja({ ...novaLoja, nome: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={novaLoja.email}
            onChange={(e) => setNovaLoja({ ...novaLoja, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Telefone"
            value={novaLoja.telefone}
            onChange={(e) => setNovaLoja({ ...novaLoja, telefone: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            inputRef={inputRef}
            label="Pesquisar Morada"
            value={novaLoja.morada.rua}
            onChange={(e) =>
              setNovaLoja((prev) => ({
                ...prev,
                morada: { ...prev.morada, rua: e.target.value },
              }))
            }
            margin="normal"
            required
          />

          {/* NOVOS CAMPOS PARA MORADA */}
          <TextField
            fullWidth
            label="Localidade"
            value={novaLoja.morada.localidade}
            onChange={(e) =>
              setNovaLoja((prev) => ({
                ...prev,
                morada: { ...prev.morada, localidade: e.target.value },
              }))
            }
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Freguesia"
            value={novaLoja.morada.freguesia}
            onChange={(e) =>
              setNovaLoja((prev) => ({
                ...prev,
                morada: { ...prev.morada, freguesia: e.target.value },
              }))
            }
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Concelho"
            value={novaLoja.morada.concelho}
            onChange={(e) =>
              setNovaLoja((prev) => ({
                ...prev,
                morada: { ...prev.morada, concelho: e.target.value },
              }))
            }
            margin="normal"
            disabled
          />
          <TextField
            fullWidth
            label="Distrito"
            value={novaLoja.morada.distrito}
            onChange={(e) =>
              setNovaLoja((prev) => ({
                ...prev,
                morada: { ...prev.morada, distrito: e.target.value },
              }))
            }
            margin="normal"
            disabled
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
          >
            Adicionar Loja
          </Button>
        </form>

        {lojas.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Lojas Registradas</Typography>
            {lojas.map((loja, i) => (
              <Box key={i} sx={{ mt: 2 }}>
                <Typography><strong>Nome:</strong> {loja.nome}</Typography>
                <Typography><strong>Morada:</strong> {loja.morada}</Typography>
                <Typography><strong>Telefone:</strong> {loja.telefone}</Typography>
                <Typography><strong>Horário:</strong> {loja.horario}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default AdicionarLoja;
