// context/InteressesContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const InteressesContext = createContext();
export const useInteresses = () => useContext(InteressesContext);

export const InteressesProvider = ({ children }) => {
  const [numeroInteresses, setNumeroInteresses] = useState(0);
  const { user, isAuthenticated } = useAuth0();

  const fetchInteresses = async () => {
    try {
      if (!user?.email) return;
      const res = await fetch(`http://localhost:9000/interesses?email=${user.email}`);
      const interesses = await res.json();
      

      if (typeof interesses.disponiveis === "number") {
        setNumeroInteresses(interesses.disponiveis);
      }
    } catch (err) {
      console.error("Erro ao buscar interesses:", err);
    }
  };

  useEffect(() => {
    fetchInteresses();
    const interval = setInterval(fetchInteresses, 1000); 
    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  return (
    <InteressesContext.Provider value={{ numeroInteresses, fetchInteresses }}>
      {children}
    </InteressesContext.Provider>
  );
};
