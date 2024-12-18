import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Box,
  MenuItem,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import api from "../../services/api";
import Notification from "../Notification/Notification";

const initialPaymentData = {
  concept: "",
  nroTarjeta: "",
  amount: "",
  currency: "",
  description: "",
};

const PaymentForm = () => {
  const [formData, setFormData] = useState(initialPaymentData);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token no encontrado");
    window.location.href = "/";
    return null; // Importante: Evita renderizado innecesario.
  }

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await api.get("/Transactions/payment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Currencies fetched:", response.data);
      } catch (err) {
        console.error("Error al obtener las monedas:", err);
      }
    };
    fetchCurrencies();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limita a 16 caracteres
    if (name === "nroTarjeta" && value.length > 16) {
      return; // No hace nada si el valor tiene más de 16 caracteres
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.concept || formData.concept.length > 100) {
      errors.concept = "El concepto es obligatorio";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "El monto debe ser mayor a cero.";
    }
    if (!formData.nroTarjeta || formData.nroTarjeta.length !== 16) {
      errors.nroTarjeta = "Debe ser una tarjeta válida";
    }
    if (!formData.currency) {
      errors.currency = "La moneda es obligatoria.";
    }
    if (!formData.concept) {
      errors.concept = "El concepto es obligatorio.";
    }
    if (!formData.description) {
      errors.concept = "El pago debe tener una descripcion.";
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
      await api.post("/transactions/payment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarMessage("Pago registrado exitosamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setFormData(initialPaymentData);
    } catch (err) {
      console.error("Error al registrar el pago:", err);
      const errorMessage = err.response
        ? err.response.data.message
        : "No se pudo conectar al servidor. Intente nuevamente.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9CD99E",
    maxWidth: 600,
  };

  return (
    <div className="payment-container">
      <Card sx={cardStyle}>
        <CardContent>
          <Typography
            sx={{
              fontSize: "1.35rem",
              color: "#2B6A2F",
              fontWeight: "bold",
            }}
            gutterBottom
          >
            Registrar Pago
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item size={12}>
                <TextField
                  fullWidth
                  name="nroTarjeta"
                  label="Numero de tarjeta"
                  type="number"
                  variant="outlined"
                  value={formData.nroTarjeta}
                  onChange={handleChange}
                  error={!!error.nroTarjeta}
                  helperText={error.nroTarjeta}
                  sx={{
                    maxLength: 16
                  }}
                />
              </Grid>
              <Grid item size={8}>
                <TextField
                  fullWidth
                  name="amount"
                  label="Monto"
                  type="number"
                  variant="outlined"
                  value={formData.amount}
                  onChange={handleChange}
                  error={!!error.amount}
                  helperText={error.amount}
                />
              </Grid>
              <Grid item size={4}>
                <TextField
                  fullWidth
                  name="currency"
                  label="Moneda"
                  select
                  variant="outlined"
                  value={formData.currency}
                  onChange={handleChange}
                  error={!!error.currency}
                  helperText={error.currency}
                >
                  <MenuItem value="">Seleccione una moneda</MenuItem>
                  <MenuItem value="ARS">ARS</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </TextField>
              </Grid>
              <Grid item size={12}>
                <TextField
                  fullWidth
                  name="concept"
                  label="Concepto"
                  select
                  variant="outlined"
                  value={formData.concept}
                  onChange={handleChange}
                  error={!!error.concept}
                  helperText={error.concept}
                >
                  <MenuItem value="">Seleccione concepto</MenuItem>
                  <MenuItem value="Servicios">Servicios</MenuItem>
                  <MenuItem value="Salud">Salud</MenuItem>
                  <MenuItem value="Alquiler">Alquiler</MenuItem>
                  <MenuItem value="Transporte">Transporte</MenuItem>
                  <MenuItem value="Comida">Comida</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </TextField>
              </Grid>
              <Grid item size={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Descripcion"
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!error.description}
                  helperText={error.description}
                />
              </Grid>
              <Grid item size={12} style={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  style={{
                    padding: "10px 30px",
                    fontWeight: "bold",
                    borderRadius: "25px",
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Pagar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Notification
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        setOpenSnackbar={setOpenSnackbar}
      />
    </div>
  );
};

export default PaymentForm;
