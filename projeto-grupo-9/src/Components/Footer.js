import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box 
      sx={{ 
        backgroundColor: "#2A2A2A", 
        color: "#E9C46A", 
        textAlign: "center", 
        padding: "10px 0", 
        position: "absolute",
        bottom: 0,
        width: "100%"
      }}
    >
      <Typography variant="body2">© 2025 Grupo 9</Typography>
    </Box>
  );
};

export default Footer;
