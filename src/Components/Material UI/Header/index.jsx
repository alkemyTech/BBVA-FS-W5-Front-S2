import React, { useState, useEffect } from 'react';
import { Button, Typography, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../../assets/img/lynxlogo.png";
import nombre from "../../../assets/img/lynxnombre2.png";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("nombre");
    const storedRole = localStorage.getItem("rol");
    setIsAuthenticated(!!token);
    if (token && storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
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
    background: "#",
    borderRadius: "25px",
    padding:"6px 16px",
    color: "#2b6a2f",
    fontWeight:"bold",
    "&:hover": {
      backgroundColor: "#9cd99e",
      color: "#FFFFFF",
    }
  };

  return (
    <Grid 
      container
      sx={{
        backgroundColor: '#FFFFFF', 
        padding: "15px 0px",
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        justifyContent: "space-around",
        alignItems:"center",
        position: "sticky", 
        top: 0,            
        zIndex: 1000, 
      }}
    >
      <Grid item size={2} sx={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center", }}>
        <Link to="/home">
          <img src={logo} width={"100px"} alt="Logo" />
        </Link>
        <Link to="/home">
          <img src={nombre} width={"100px"} alt="Marca" />
        </Link>
      </Grid>

      {isAuthenticated && (
        <Grid
          item
          size={8}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap:4,
          }}
        >
          <Link to="/Transferencias" style={{ textDecoration: 'none', color: '#' }}>
            <Typography sx={buttonStyles} variant="body1">Transferencias</Typography>
          </Link>
          <Link to="/Pago" style={{ textDecoration: 'none', color: '#' }}>
            <Typography sx={buttonStyles} variant="body1">Nuevo Pago</Typography>
          </Link>
          <Link to="/Balance" style={{ textDecoration: 'none', color: '#' }}>
            <Typography sx={buttonStyles} variant="body1">Balance</Typography>
          </Link>
          <Link to="/Inversiones" style={{ textDecoration: 'none', color: '#' }}>
            <Typography sx={buttonStyles} variant="body1">Inversiones</Typography>
          </Link>
          {userRole === "ADMIN" && (
            <Link to="/Usuarios" style={{ textDecoration: 'none', color: '#' }}>
              <Typography sx={buttonStyles} variant="body1">Usuarios</Typography>
            </Link>
          )}
        </Grid>
      )}

      {isAuthenticated && (
        <Grid
          item
          size={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:"center",
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