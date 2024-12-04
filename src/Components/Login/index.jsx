import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import fondo from "../../assets/img/fondo.png";
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
        width: "70vw",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        textAlign: "center",
        borderRadius: "15px",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        size={6}
        sx={{
          padding: "60px",
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
            color: "#016a85",
            fontSize: "4rem",
            letterSpacing: "2px",
          }}
        >
          Sign In
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginBottom: "40px",
            textAlign: "center",
            color: "#3A3A3A",
          }}
        >
          Please enter your details
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
                E-mail address
              </Typography>
              <TextField
                fullWidth
                placeholder="Type your e-mail"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailRoundedIcon />
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
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Type your password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
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
                fullWidth
                sx={{
                  marginTop: "40px",
                  background: "#016a85",
                  padding: "15px 35px",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid
        item
        size={6}
        sx={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "60px",
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
          New here?
        </Typography>
        <Typography
          sx={{
            color: "#f9f9f9dd",
            marginBottom: "60px",
            fontSize: "2.1rem",
            lineHeight: 1.5,
          }}
        >
          Sign up and discover a great amount of new opportunities
        </Typography>
        <Button
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#016a85",
            fontWeight: "bold",
            padding: "15px 35px",
            borderRadius: "25px",
            width: "30vw",
          }}
          onClick={() => navigate("/register")}
        >
          Sign Up
        </Button>
      </Grid>
    </Grid>
  );
}