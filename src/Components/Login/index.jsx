import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import api from "../../services/api";
import Notification from "../Notification/Notification";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (location.state?.success) {
      setSnackbarMessage("Usuario creado con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("nombre", response.data.nombre);
      localStorage.setItem("apellido", response.data.apellido);
      localStorage.setItem("rol", response.data.rol);
      navigate("/home");
    } catch (error) {
      setError(true);
      setEmail("");
      setPassword("");
      console.log(error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Grid
      container
      sx={{
        width: "50vw",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        textAlign: "center",
        borderRadius: "25px",
        overflow: "hidden",
        padding: "10px",

      }}
    >
      <Grid
        item
        size={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
          Por favor ingresa tus datos
        </Typography>
        <form onSubmit={handleLogin}>
          <Grid container spacing={3}>
            <Grid item size={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  marginBottom: "5px",
                  color: "#616161",
                  textAlign: "left",
                }}
              >
                E-mail
              </Typography>
              <TextField
                fullWidth
                placeholder="Ingresa tu email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailRoundedIcon sx={{ color: "#43A047" }} /> 
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
                error={error}
              />
            </Grid>
            <Grid item size={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  marginBottom: "5px",
                  color: "#616161",
                  textAlign: "left",
                }}
              >
                Contraseña
              </Typography>
              <TextField
                fullWidth
                placeholder="Ingresa tu contraseña"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ color: "#43A047" }} ></LockRoundedIcon>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: "#66BB6A" }} 
                          aria-label={showPassword ? 'hide password' : 'show password'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
                error={error}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  marginBottom: "10px",
                  color:"#43A047",
                  textAlign: "right",
                }}
              >
                Olvidé mi contraseña
              </Typography>
              {error && (
                <Typography color="error" sx={{ marginTop: "20px", textAlign: "center" }}>
                  El usuario o la contraseña son incorrectos
                </Typography>
              )}
            </Grid>

            <Grid item size={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  marginTop: "40px",
                  background: "#43A047",
                  padding: "15px 35px",
                  borderRadius: "25px",
                  fontWeight: "bold",
                  width: "20vw",
                }}
              >
                Iniciar sesión
              </Button>
              <Typography
                variant="body2"
                sx={{
                marginTop: "15px",
                color: "#66BB6A",
                cursor: "pointer",
                textDecoration: "underline",
                }}
                onClick={() => navigate("/signup")}
            >
              {successMessage}
            </Typography>
          )}
          <form onSubmit={handleLogin}>
            <Grid container spacing={3}>
              <Grid item size={12}>
                <TextField
                  fullWidth
                  placeholder="Ingresa tu email"
                  label="E-mail"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailRoundedIcon sx={{ color: "#43A047" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                  }}
                  error={error}
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  fullWidth
                  placeholder="Ingresa tu contraseña"
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRoundedIcon sx={{ color: "#43A047" }} />{" "}
                          {/* Cambié el verde aquí */}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{ color: "#66BB6A" }} // Cambié el verde aquí
                            aria-label={
                              showPassword ? "hide password" : "show password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                  }}
                  error={error}
                />
                {error && (
                  <Typography
                    color="error"
                    sx={{ marginTop: "20px", textAlign: "center" }}
                  >
                    El usuario o la contraseña son incorrectos
                  </Typography>
                )}
              </Grid>

              <Grid item size={12}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    marginTop: "40px",
                    background: "#43A047",
                    padding: "15px 35px",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    width: "20vw",
                  }}
                >
                  Iniciar sesión
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "15px",
                    color: "#66BB6A",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate("/signup")}
                >
                  ¿No tienes cuenta? Crea una aquí
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>

      <Notification
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        setOpenSnackbar={setOpenSnackbar}
        loading={loading}
      />
    </div>
  );
}
