import React, { useEffect, useRef, useState } from "react";

const MapaComEndereco = ({ endereco, apiKey }) => {
  const mapRef = useRef(null);
  const [coordenadas, setCoordenadas] = useState(null);

  useEffect(() => {
    const geocodificarEndereco = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordenadas({ lat, lng });
        } else {
          console.error("Erro ao geocodificar:", data.status);
        }
      } catch (error) {
        console.error("Erro na chamada da API:", error);
      }
    };

    geocodificarEndereco();
  }, [endereco, apiKey]);

  useEffect(() => {
    if (coordenadas && window.google) {
      const mapa = new window.google.maps.Map(mapRef.current, {
        center: coordenadas,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: coordenadas,
        map: mapa,
      });
    }
  }, [coordenadas]);

  return (
    <div>
      <h3>Mapa da morada: {endereco}</h3>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", borderRadius: "8px" }}
      ></div>
    </div>
  );
};

export default MapaComEndereco;
