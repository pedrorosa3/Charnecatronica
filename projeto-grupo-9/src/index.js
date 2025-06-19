import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CarrinhoProvider } from "./Context/CarrinhoContext";
import { Auth0Provider } from "@auth0/auth0-react";

//Auth0
const domain = process.env.REACT_APP_AUTH_DOMAIN;
const clientId = process.env.REACT_APP_AUTH_CLIENTID;
//const audience = "https://a-tua-api.com"; // opcional, só se quiseres usar JWT para o backend

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        //audience: audience, // podes remover se não estás a usar APIs protegidas
      }}
    >
      <CarrinhoProvider>
        <App />
      </CarrinhoProvider>
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
