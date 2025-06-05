import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const VenderCliente = () => {
  const [lojas, setLojas] = useState([]);
  const mapRef = useRef(null);
  const mapa = useRef(null);
  const marcadoresRef = useRef([]);

  const formatarHorario = (textoHorario) => {
    const [inicio, fim] = textoHorario.split(" - ");
    return `${inicio.slice(0, 5)} - ${fim.slice(0, 5)}`;
  };

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
      gestureHandling: "greedy",
    });
  }, []);

  useEffect(() => {
    if (!mapa.current) return;
    desenharMarcadores(lojas);
  }, [lojas]);

  const desenharMarcadores = (lista) => {
    marcadoresRef.current = [];

    lista.forEach((loja) => {
      const marker = new window.google.maps.Marker({
        position: loja.posicao,
        map: mapa.current,
        title: loja.nome,
      });

      const horarioFormatado = formatarHorario(loja.horario);

      const info = new window.google.maps.InfoWindow({
        content: `
          <div>
            <strong>${loja.nome}</strong><br/>
            ${loja.morada}<br/>
            ${loja.telefone}<br/>
            <small>Horário: ${horarioFormatado}</small>
          </div>
        `,
      });

      marker.addListener("click", () => {
        info.open(mapa.current, marker);
      });

      marcadoresRef.current.push({ marker, info });
    });
  };

  const handleLojaClick = (index) => {
    const item = marcadoresRef.current[index];
    if (item) {
      mapa.current.panTo(item.marker.getPosition());
      mapa.current.setZoom(15);
      item.info.open(mapa.current, item.marker);
    }
  };

  return (
    <>
      <Header />

      <Container sx={{ mt: 15, mb: 10 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Venda o seu equipamento:
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, fontSize: "18px" }}>
          Na <strong>Charnecatrónica</strong>, valorizamos a reutilização e
          damos uma nova vida aos seus equipamentos eletrónicos usados.
          Compramos dispositivos em boas condições a um preço justo, promovendo
          a circulação da economia e reduzindo o desperdício. Basta dirigir-se a
          uma das nossas lojas, onde a nossa equipa analisará o seu equipamento
          e fará uma proposta de compra sem compromisso.
        </Typography>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          As nossas lojas:
        </Typography>

        <Box
          ref={mapRef}
          sx={{
            width: "100%",
            height: 400,
            borderRadius: 2,
            mb: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />

        {lojas.length > 0 && (
          <Box>
            {lojas.map((loja, i) => (
              <Box
                key={i}
                onClick={() => handleLojaClick(i)}
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
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
                  <strong>Horário:</strong> {formatarHorario(loja.horario)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50px",
          bgcolor: "#222",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1500,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Footer />
      </Box>
    </>
  );
};

export default VenderCliente;
