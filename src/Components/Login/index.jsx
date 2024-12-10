import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from '../../services/UserSlice';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton
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
  const dispatch = useDispatch();

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
      
      // Despacha los datos al Redux Store
      dispatch(setUser({
        email,
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        rol: response.data.rol,
        token: response.data.token,
      }));
      
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Grid
        container
        sx={{
          width: "50vw",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          textAlign: "center",
          borderRadius: "25px",
          overflow: "hidden",
        }}
      >
        <Grid
          item
          size={12}
          sx={{
            padding: "30px",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Typography
            sx={{
              marginBottom: "10px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "4rem",
              letterSpacing: "2px",
            }}
          >
            Iniciar sesión
          </Typography>
          <Typography
            variant="h6"
            sx={{
              marginBottom: "40px",
              textAlign: "center",
              color: "#3A3A3A",
            }}
          >
            Por favor ingresa tus datos
          </Typography>
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
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{ color: "#43A047" }}
                            aria-label={showPassword ? "hide password" : "show password"}
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}

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
