import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <HomePage />
      </Router>
    </ThemeProvider>
  );
}

export default App;
