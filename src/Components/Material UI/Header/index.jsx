import React, { useState, useEffect } from "react";
import { Typography, Menu, MenuItem, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // Estado para almacenar el rol
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("nombre"); // Nombre del usuario guardado
    const storedRole = localStorage.getItem("rol"); // Rol del usuario guardado (admin, user, etc.)
    setIsAuthenticated(!!token); // Establece la autenticación según el token
    if (token && storedName) {
      setUserName(storedName);
    }
    if (storedRole) {
      setUserRole(storedRole); // Establece el rol
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole("");
    navigate("/");
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const buttonStyles = {
    textTransform: "none",
    color: "#43A047",
    border: "2px solid transparent",
    margin: "0 5px",
    padding: "6px 5px",
    "&:hover": {
      backgroundColor: "#43A047",
      color: "#fff",
      border: "2px solid #43A047",
      borderRadius: "12px",
    },
  };

  return (
    <Grid
      container
      sx={{
        padding: "20px",
        borderRadius: "20px",
        border: "1px solid #43A047",
        backgroundColor: "#FFFFFF",
        textAlign: "center",
        margin: "2vh auto",
        maxWidth: "70%",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Grid
        item
        size={2}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Link to="/home">
          <img src="logo.png" width={"50px"} alt="Logo" />
        </Link>
        <Typography variant="h3">Lynx</Typography>
      </Grid>

      {/* Navbar completo si está autenticado */}
      {isAuthenticated && (
        <Grid
          item
          size={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap", // Asegura que los botones se acomoden en la misma línea
          }}
        >
          <Button sx={buttonStyles} component={Link} to="/transferencias">
            Transferencias
          </Button>
          <Button sx={buttonStyles} component={Link} to="/nuevoPago">
            Nuevo Pago
          </Button>
          <Button sx={buttonStyles} component={Link} to="/misPagos">
            Balance
          </Button>
          <Button sx={buttonStyles} component={Link} to="/tarjetas">
            Tarjetas
          </Button>
          <Button sx={buttonStyles} component={Link} to="/inversiones">
            Inversiones
          </Button>

          {/* Mostrar el botón de "Usuarios" solo si el rol es admin */}
          {userRole === "ADMIN" && (
            <Button sx={buttonStyles} component={Link} to="/usuarios">
              Usuarios
            </Button>
          )}
        </Grid>
      )}

      {/* Solo mostrar el saludo y opciones de usuario si está autenticado */}
      {isAuthenticated && (
        <Grid
          item
          size={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              color: "#000",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={handleUserMenuOpen}
          >
            Hola, {userName || "Usuario"}
          </Typography>
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={() => navigate("/perfil")}>Mi perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Grid>
      )}
    </Grid>
  );
}
