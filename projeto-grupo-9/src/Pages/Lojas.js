import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import Header from "../Components/Header";

const AdicionarLoja = () => {
  const [lojas, setLojas] = useState([]);
  const [mensagem, setMensagem] = useState(null); // mensagem para erros/alertas dentro do modal
  const [tipoMensagem, setTipoMensagem] = useState("success");
  const [abrirModal, setAbrirModal] = useState(false);
  const [mensagemGlobal, setMensagemGlobal] = useState(null); // mensagem que aparece fora do modal

  const [novaLoja, setNovaLoja] = useState({
    nome: "",
    telefone: "",
    email: "",
    horarioAbertura: "",
    horarioFecho: "",
    morada: {
      pais: "Portugal",
      localidade: "",
      latitude: null,
      longitude: null,
      freguesia: "",
      rua: "",
      numero: "",
      codigopostal: "",
      concelho: "",
      distrito: "",
    },
  });

  const mapRef = useRef(null);
  const mapa = useRef(null);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const res = await fetch("http://localhost:9000/lojas");
        if (!res.ok) throw new Error("Erro ao buscar lojas");
        const data = await res.json();
        setLojas(data);
      } catch (err) {
        console.error("❌ Erro ao buscar lojas:", err);
      }
    };

    fetchLojas();

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
    if (abrirModal && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "pt" },
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const getComp = (type) => {
            const comp = place.address_components?.find((c) => c.types.includes(type));
            return comp ? comp.long_name : "";
          };

          const morada = {
            rua: getComp("route") || place.name || "",
            numero: getComp("street_number"),
            localidade: getComp("locality"),
            freguesia: getComp("sublocality_level_1") || getComp("administrative_area_level_3"),
            concelho: getComp("administrative_area_level_2"),
            distrito: getComp("administrative_area_level_1"),
            codigopostal: getComp("postal_code") || "",
            pais: getComp("country"),
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };

          setNovaLoja((prev) => ({ ...prev, morada }));
        }
      });
    }
  }, [abrirModal]);

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
            ${loja.telefone}<br/>
            <small>Horário: ${loja.horario}</small>
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
          horarioabertura: novaLoja.horarioAbertura,
          horariofecho: novaLoja.horarioFecho,
          morada: novaLoja.morada,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar loja");

      const data = await res.json();

      setLojas([
        ...lojas,
        {
          nome: novaLoja.nome,
          morada: `${novaLoja.morada.rua}, ${novaLoja.morada.numero}, ${novaLoja.morada.localidade}`,
          telefone: novaLoja.telefone,
          horario: `${novaLoja.horarioAbertura} - ${novaLoja.horarioFecho}`,
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
        horarioAbertura: "",
        horarioFecho: "",
        morada: {
          pais: "Portugal",
          localidade: "",
          latitude: null,
          longitude: null,
          freguesia: "",
          rua: "",
          numero: "",
          codigopostal: "",
          concelho: "",
          distrito: "",
        },
      });

      setAbrirModal(false);

      // Mostrar mensagem global centralizada por 1 segundo
      setMensagemGlobal("Loja criada com sucesso!");
      setTipoMensagem("success");
      setTimeout(() => {
        setMensagemGlobal(null);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao criar loja.");
      setTipoMensagem("error");
    }
  };

  return (
    <>
      <style>{`
        .pac-container {
          z-index: 1400 !important;
        }
        /* Estilos para mensagem global centralizada */
        .mensagem-global {
          position: fixed;
          top: 120px; /* ajusta para ficar logo abaixo do header */
          left: 50%;
          transform: translateX(-50%);
          z-index: 1500;
          width: 300px;
          text-align: center;
          animation: fadeInOut 3s forwards;
          pointer-events: none; /* não interfere em cliques */
        }
        @keyframes fadeInOut {
          0% {opacity: 0;}
          10% {opacity: 1;}
          90% {opacity: 1;}
          100% {opacity: 0;}
        }
      `}</style>

      <Header />
      <Container sx={{ mt: 12, position: "relative" }}>
        <Typography variant="h4" gutterBottom>
          Gestão de Lojas
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 2, backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
          onClick={() => setAbrirModal(true)}
        >
          + Adicionar Loja
        </Button>

        {/* Mensagem global aparece fixada centralizada e com animação */}
        {mensagemGlobal && (
          <Alert severity={tipoMensagem} className="mensagem-global">
            {mensagemGlobal}
          </Alert>
        )}

        <Box
          ref={mapRef}
          sx={{ width: "100%", height: 400, borderRadius: 2, mb: 4 }}
        />

        <Dialog
          open={abrirModal}
          onClose={() => setAbrirModal(false)}
          TransitionComponent={Fade}
          fullWidth
          maxWidth="sm"
          disableEnforceFocus
          keepMounted
        >
          <DialogTitle>Adicionar Loja</DialogTitle>
          <DialogContent>
            {mensagem && (
              <Alert severity={tipoMensagem} onClose={() => setMensagem(null)} sx={{ mb: 2 }}>
                {mensagem}
              </Alert>
            )}
            <form onSubmit={handleSubmit} id="form-adicionar-loja">
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
                onChange={(e) => {
                  const valor = e.target.value;
                  if (/^\d{0,9}$/.test(valor)) {
                    setNovaLoja({ ...novaLoja, telefone: valor });
                  }
                }}
                margin="normal"
                required
                inputProps={{ maxLength: 9 }}
              />

              <TextField
                fullWidth
                label="Horário de Abertura"
                type="time"
                value={novaLoja.horarioAbertura}
                onChange={(e) => setNovaLoja({ ...novaLoja, horarioAbertura: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Horário de Fecho"
                type="time"
                value={novaLoja.horarioFecho}
                onChange={(e) => setNovaLoja({ ...novaLoja, horarioFecho: e.target.value })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                inputRef={inputRef}
                label="Pesquisar Morada"
                value={novaLoja.morada.rua}
                onChange={(e) =>
                  setNovaLoja((prev) => ({ ...prev, morada: { ...prev.morada, rua: e.target.value } }))
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Número da Porta"
                value={novaLoja.morada.numero}
                onChange={(e) =>
                  setNovaLoja((prev) => ({ ...prev, morada: { ...prev.morada, numero: e.target.value } }))
                }
                margin="normal"
                required
              />
              <TextField fullWidth label="Localidade" value={novaLoja.morada.localidade} margin="normal" disabled />
              <TextField fullWidth label="Freguesia" value={novaLoja.morada.freguesia} margin="normal" disabled />
              <TextField fullWidth label="Concelho" value={novaLoja.morada.concelho} margin="normal" disabled />
              <TextField fullWidth label="Distrito" value={novaLoja.morada.distrito} margin="normal" disabled />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAbrirModal(false)}>Cancelar</Button>
            <Button
              type="submit"
              form="form-adicionar-loja"
              variant="contained"
              sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        {lojas.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Lojas Registradas</Typography>
            {lojas.map((loja, i) => (
              <Box
                key={i}
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography>
                  <strong>Nome:</strong> {loja.nome}
                </Typography>
                <Typography>
                  <strong>Morada:</strong> {loja.morada}
                </Typography>
                <Typography>
                  <strong>Telefone:</strong> {loja.telefone}
                </Typography>
                <Typography>
                  <strong>Horário:</strong> {loja.horario}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default AdicionarLoja;
