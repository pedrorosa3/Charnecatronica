import React, { useEffect, useState, useRef } from "react";


function Lojas() {
  const [lojas, setLojas] = useState([
  {
    nome: "Charnecatrónica - Sede",
    morada: "Rua Principal 1, Charneca da Caparica",
    telefone: "212 345 678",
    horario: "Seg a Sex: 9h - 18h",
    posicao: { lat: 38.6275, lng: -9.1853 },
  },
  {
    nome: "Charnecatrónica - Almada",
    morada: "Avenida Central 100, Almada",
    telefone: "212 876 543",
    horario: "Seg a Sáb: 10h - 19h",
    posicao: { lat: 38.6792, lng: -9.1604 },
  },
]); // tuas lojas iniciais
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novaLoja, setNovaLoja] = useState({ morada: "", telefone: "" });
  const mapRef = useRef(null);
  const mapa = useRef(null);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    mapa.current = new window.google.maps.Map(mapRef.current, {
      center: lojas[0].posicao,
      zoom: 12,
    });

    desenharMarcadores(lojas);
  }, []);

  useEffect(() => {
    if (!mapa.current) return;

    mapa.current = new window.google.maps.Map(mapRef.current, {
      center: lojas[0].posicao,
      zoom: 12,
    });

    desenharMarcadores(lojas);
  }, [lojas]);

  useEffect(() => {
    if (mostrarFormulario && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "pt" },
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        console.log("PLACE", place);
        if (place.geometry) {
          setNovaLoja({
            ...novaLoja,
            morada: place.formatted_address,
            posicao: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          });
        }
      });
    }
  }, [mostrarFormulario]);

  const desenharMarcadores = (listaLojas) => {
    listaLojas.forEach((loja) => {
      const marker = new window.google.maps.Marker({
        position: loja.posicao,
        map: mapa.current,
        title: loja.nome,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <strong>${loja.nome}</strong><br/>
            ${loja.morada}<br/>
            ${loja.telefone}
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapa.current, marker);
      });
    });
  };

  const handleAdicionarLoja = (e) => {
    e.preventDefault();

    if (!novaLoja.posicao) {
      alert("Por favor selecione uma morada válida.");
      return;
    }

    const nova = {
      nome: `Charnecatrónica - Nova Loja`,
      morada: novaLoja.morada,
      telefone: novaLoja.telefone,
      horario: "A definir",
      posicao: novaLoja.posicao,
    };

    setLojas([...lojas, nova]);
    setNovaLoja({ morada: "", telefone: "", posicao: null });
    autocompleteRef.current = null;
    setMostrarFormulario(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lojas Charnecatrónica</h1>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "400px",
          marginBottom: "2rem",
          borderRadius: "8px",
        }}
      ></div>

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        {mostrarFormulario ? "Cancelar" : "Criar nova loja"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleAdicionarLoja} style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Morada: </label>
            <input
              ref={inputRef}
              type="text"
              value={novaLoja.morada}
              onChange={(e) => setNovaLoja({ ...novaLoja, morada: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Telefone: </label>
            <input
              type="text"
              value={novaLoja.telefone}
              onChange={(e) => setNovaLoja({ ...novaLoja, telefone: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Adicionar
          </button>
        </form>
      )}

      {lojas.map((loja, index) => (
        <div key={index} style={{ marginBottom: "1.5rem" }}>
          <h2>{loja.nome}</h2>
          <p><strong>Morada:</strong> {loja.morada}</p>
          <p><strong>Telefone:</strong> {loja.telefone}</p>
          <p><strong>Horário:</strong> {loja.horario}</p>
        </div>
      ))}
    </div>
  );
}

export default Lojas;
