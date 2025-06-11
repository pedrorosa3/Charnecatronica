
import React from "react";
import { useInteresses } from "../Context/InteressesContext";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

const IconInteresses = () => {
  const { numeroInteresses } = useInteresses() || {};
  const navigate = useNavigate();
  
  

  return (
    <IconButton onClick={() => navigate("/interesses")}color="inherit">
      <Badge
        badgeContent={numeroInteresses || 0}
        color="error"
        overlap="circular"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MailIcon style={{ color: "black" }} />
      </Badge>
    </IconButton>
  );
};

export default IconInteresses;