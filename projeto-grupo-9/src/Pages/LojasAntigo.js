import React, { useEffect, useState, useRef } from "react";

function Lojas() {
  const [lojas, setLojas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
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
    mapa.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 38.6275, lng: -9.1853 },
      zoom: 12,
    });
    desenharMarcadores(lojas);
  }, [lojas]);

  useEffect(() => {
    if (mostrarFormulario && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();

        if (place.geometry) {
          const addressComponents = place.address_components || [];
          const getComponent = (type) => {
            const comp = addressComponents.find(c => c.types.includes(type));
            return comp ? comp.long_name : "";
          };

          const morada = {
            rua: getComponent("route") || place.name || "",
            numero: getComponent("street_number"),
            localidade: getComponent("locality"),
            freguesia: getComponent("sublocality") || getComponent("administrative_area_level_2"),
            concelho: getComponent("administrative_area_level_2"),
            distrito: getComponent("administrative_area_level_1"),
            codigopostal: getComponent("postal_code"),
            pais: getComponent("country"),
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };

          setNovaLoja((prev) => ({
            ...prev,
            morada,
          }));
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

  const handleAdicionarLoja = async (e) => {
    e.preventDefault();

    if (!novaLoja.morada.latitude || !novaLoja.morada.longitude) {
      alert("Por favor selecione uma morada válida.");
      return;
    }

    try {
      const res = await fetch(process.env.REACT_APP_URL_HOST+"/lojas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novaLoja.nome || "Charnecatrónica - Nova Loja",
          numerotelefone: novaLoja.telefone,
          email: novaLoja.email || "loja@charnecatronica.pt",
          //morada: novaLoja.morada,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar loja");

      alert("Loja criada com sucesso!");
      setLojas([
        ...lojas,
        {
          nome: novaLoja.nome,
          morada: novaLoja.morada.rua,
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
      setMostrarFormulario(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar loja.");
    }
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
          <input
            type="text"
            placeholder="Nome da Loja"
            value={novaLoja.nome}
            onChange={(e) => setNovaLoja({ ...novaLoja, nome: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={novaLoja.email}
            onChange={(e) => setNovaLoja({ ...novaLoja, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Telefone"
            value={novaLoja.telefone}
            onChange={(e) => setNovaLoja({ ...novaLoja, telefone: e.target.value })}
            required
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar morada..."
            value={novaLoja.morada.rua}
            onChange={(e) =>
              setNovaLoja({
                ...novaLoja,
                morada: { ...novaLoja.morada, rua: e.target.value },
              })
            }
            required
          />
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
