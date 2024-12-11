import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../services/api";
import "./SignUp.css";
import Notification from "../Notification/Notification";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function SignUp() {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "El nombre es obligatorio";
    if (!formData.lastName) errors.lastName = "El apellido es obligatorio";
    if (!formData.email) {
      errors.email = "El email es obligatorio";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Debe ser un email válido";
    }
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(formData.password)
    ) {
      errors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un signo especial.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      setLoading(false);
      navigate("/", { state: { success: true } }); // Redirigir al login
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response
        ? err.response.data.message
        : "No se pudo conectar al servidor. Intente nuevamente.";
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <div>
    <Grid container spacing={3} direction="column" class="grid-container">
      <Grid item class="grid-item">
        <Typography class="form-title">Registrarse</Typography>
        <Typography
          variant="h6"
          sx={{
            marginBottom: "40px",
            textAlign: "center",
            color: "#3A3A3A",
          }}
        >
          Completa el formulario para crear tu cuenta
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            {[{
              name: "firstName",
              label: "Nombre",
              placeholder: "Ingresa tu nombre",
              icon: <PersonRoundedIcon sx={{ color: "#43A047" }} />,
              error: error.firstName,
              helperText: error.firstName,
            }, {
              name: "lastName",
              label: "Apellido",
              placeholder: "Ingresa tu apellido",
              icon: <PersonRoundedIcon sx={{ color: "#43A047" }} />,
              error: error.lastName,
              helperText: error.lastName,
            }, {
              name: "email",
              label: "Email",
              placeholder: "Ingresa tu email",
              icon: <MailRoundedIcon sx={{ color: "#43A047" }} />,
              error: error.email,
              helperText: error.email,
            }, {
              name: "password",
              label: "Contraseña",
              placeholder: "Ingresa tu contraseña",
              type: showPassword ? "text" : "password",
              icon: <LockRoundedIcon sx={{ color: "#43A047" }} />,
              endAdornment: (
                <IconButton
                  sx={{ color: "#66BB6A" }}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              error: error.password,
              helperText: error.password,
            }].map(({
              name,
              label,
              placeholder,
              icon,
              endAdornment,
              error,
              helperText,
              type
            }, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  name={name}
                  type={type}
                  label={label}
                  placeholder={placeholder}
                  variant="outlined"
                  value={formData[name]}
                  onChange={handleChange}
                  error={!!error}
                  helperText={helperText}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          {icon}
                        </InputAdornment>
                      ),
                      endAdornment: endAdornment && (
                        <InputAdornment position="end">
                          {endAdornment}
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  marginTop: "20px",
                  background: "#43A047",
                  padding: "15px 35px",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Registrarse"
                )}
              </Button>
              {error.general && (
                <Typography color="error" class="error-message">
                  {error.general}
                </Typography>
              )}
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
