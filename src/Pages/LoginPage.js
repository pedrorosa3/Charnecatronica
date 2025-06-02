import React from "react";
import {
  Box,
  Container,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box flex="1" display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="sm">
          <Card sx={{ width: "100%", padding: 3, textAlign: "center" }}>
            <CardContent>
              {isAuthenticated ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    Bem-vindo, {user.name}
                  </Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom>
                    Login
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      backgroundColor: "black",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                    }}
                    onClick={() => loginWithRedirect()}
                  >
                    Entrar com Auth0
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginPage;
