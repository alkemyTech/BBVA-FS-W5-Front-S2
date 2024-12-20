import React, { useState, useEffect } from "react";
import { Button, Typography, Menu, MenuItem } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid2";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/img/lynxlogo.png";
import nombre from "../../../assets/img/lynxnombre2.png";
import { setUser, logout } from "../../../services/UserSlice";
export default function Header() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isAuthenticated = Boolean(user.token);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      dispatch(setUser(parsedUser));
    }
  }, [dispatch]);
  useEffect(() => {
    if (isAuthenticated) {

      const capitalizeWords = (text) =>
        text
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

      const formattedName = capitalizeWords(user.nombre || "");
      const formattedSurname = capitalizeWords(user.apellido || "");
      setUserName(`${formattedName} ${formattedSurname}`);

      setUserRole(user.rol);
    }
  }, [isAuthenticated, user]);
  const handleLogout = () => {
    dispatch(logout());
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
    padding: "6px 16px",
    color: "#2B6A2F",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#9CD99E",
      color: "#FFFFFF",
    },
  };
  return (
    <Grid
      container
      sx={{
        backgroundColor: "#FFFFFF",
        textAlign: "center",
        padding: "15px 0px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        justifyContent: "space-evenly",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Grid
        item
        size={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
            gap: 4,
          }}
        >
          <Link
            to="/Transacciones"
            style={{ textDecoration: "none", color: "#" }}
          >
            <Typography sx={buttonStyles} variant="body1">
              Transferencias
            </Typography>
          </Link>
          <Link to="/Balance" style={{ textDecoration: "none", color: "#" }}>
            <Typography sx={buttonStyles} variant="body1">
              Balance
            </Typography>
          </Link>
          <Link to="/Payment" style={{ textDecoration: "none", color: "#" }}>
            <Typography sx={buttonStyles} variant="body1">
              Pagar Servicio
            </Typography>
          </Link>
          <Link to="/PlazoFijo" style={{ textDecoration: "none", color: "#" }}>
            <Typography sx={buttonStyles} variant="body1">
              Plazo Fijo
            </Typography>
          </Link>
          {userRole === "ADMIN" && (
            <Link to="/Usuarios" style={{ textDecoration: "none", color: "#" }}>
              <Typography sx={buttonStyles} variant="body1">
                Usuarios
              </Typography>
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
            justifyContent: "center",
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
