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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import api from "../../services/Api";
import Notification from "../Notification/Notification";

const initialPaymentData = {
  concept: "",
  amount: "",
  currency: "",
  date: "",
};

const PaymentForm = () => {
  const [formData, setFormData] = useState(initialPaymentData);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token no encontrado");
    window.location.href = "/";
    return;
  }

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await api.get("/currencies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrencies(response.data);
      } catch (err) {
        console.error("Error al obtener las monedas:", err);
      }
    };
    fetchCurrencies();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.concept || formData.concept.length > 100) {
      errors.concept = "El concepto es obligatorio y debe tener menos de 100 caracteres.";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "El monto debe ser mayor a cero.";
    }
    if (!formData.currency) {
      errors.currency = "La moneda es obligatoria.";
    }
    if (!formData.date) {
      errors.date = "La fecha es obligatoria.";
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
      await api.post("/payment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarMessage("Pago registrado exitosamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setFormData(initialPaymentData);
    } catch (err) {
      console.error("Error al registrar el pago:", err.response || err);
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

  return (
    <div>
      <Grid container spacing={3} direction="column" className="grid-container">
        <Grid item className="grid-item">
          <Typography variant="h4" align="center" className="form-title">
            Registrar Pago
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="concept"
                  label="Concepto"
                  variant="outlined"
                  value={formData.concept}
                  onChange={handleChange}
                  error={!!error.concept}
                  helperText={error.concept}
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="currency"
                  label="Moneda"
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={formData.currency}
                  onChange={handleChange}
                  error={!!error.currency}
                  helperText={error.currency}
                >
                  <option value="">Seleccione una moneda</option>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="date"
                  label="Fecha"
                  type="date"
                  variant="outlined"
                  value={formData.date}
                  onChange={handleChange}
                  error={!!error.date}
                  helperText={error.date}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
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
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Registrar"}
                </Button>
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
      />
    </div>
  );
};

export default PaymentForm;