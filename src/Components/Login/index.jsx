import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import fondo2 from "../../assets/img/fondo2.png";
import Grid from "@mui/material/Grid2";
import api from "../../services/api";
import AuthService from "../../services/AuthService";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("nombre", response.data.nombre);
      localStorage.setItem("apellido", response.data.apellido);
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
        width: "60vw",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        textAlign: "center",
        borderRadius: "15px",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        size={7}
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
            color: "#5B9C96",
            fontSize: "4rem",
            letterSpacing: "2px",
          }}
        >
            Iniciar sesion
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginBottom: "40px",
            textAlign: "center",
            color: "#3A3A3A",
          }}
        >
          Porfavor ingresa tus datos
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
                        <MailRoundedIcon  sx={{ color: "#5B9C96" }}/>
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
                        <LockRoundedIcon  sx={{ color: "#5B9C96" }}/>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton sx={{ color: "#5B9C96" }}
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
                  color: "#5B9C96",
                  textAlign: "right",
                }}
              >
                Olvide mi contraseña
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
                  background: "#5B9C96",
                  padding: "15px 35px",
                  borderRadius: "25px",
                  fontWeight: "bold",
                  width: "20vw",
                }}
              >
                Iniciar sesion
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid
        item
        size={5}
        sx={{
          backgroundColor:"#5B9C96",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#F9F9F9",
            marginBottom: "40px",
            fontWeight: "bold",
            fontSize: "4rem",
            letterSpacing: "2px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
          }}
        >
          Sos nuevo?
        </Typography>
        <Typography
          sx={{
            color: "#f9f9f9dd",
            marginBottom: "60px",
            fontSize: "2.1rem",
            lineHeight: 1.5,
          }}
        >
          Crea tu cuenta y descubri los mejores beneficios para vos
        </Typography>
        <Button
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#5B9C96",
            fontWeight: "bold",
            padding: "15px 35px",
            borderRadius: "25px",
            width: "20vw",
          }}
          onClick={() => navigate("/register")}
        >
            Registrarse
        </Button>
      </Grid>
    </Grid>
  );
}