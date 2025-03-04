import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#22221F",
        color: "#FFFFFF",
        textAlign: "center",
        padding: "15px 0",
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2">© 2025 Charnecatrónica</Typography>
    </Box>
  );
};

export default Footer;
