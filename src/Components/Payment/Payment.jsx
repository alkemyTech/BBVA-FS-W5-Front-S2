import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import Grid from "@mui/material/Grid2";
import api from "../../services/api";
import Notification from "../Notification/Notification";
import { useNavigate } from "react-router-dom";

// Logos de las tarjetas (puedes reemplazar las rutas con las tuyas)
import VisaLogo from "../../assets/img/visa.png";
import MasterCardLogo from "../../assets/img/mastercard.png";
import AmexLogo from "../../assets/img/amess.png";
//import DiscoverLogo from "./logos/discover.png";

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
  const [cardType, setCardType] = useState(""); // Tipo de tarjeta
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    console.error("Token no encontrado");
    window.location.href = "/";
    return null; // Importante: Evita renderizado innecesario.
  }

  // Función para detectar el tipo de tarjeta
  const detectCardType = (number) => {
    const sanitized = number.replace(/\s+/g, ""); // Elimina espacios
    if (/^4/.test(sanitized)) return "Visa";
    if (
      /^5[1-5]/.test(sanitized) ||
      /^2(2[2-9]|[3-6]|7[0-1]|720)/.test(sanitized)
    )
      return "Mastercard";
    if (/^3[47]/.test(sanitized)) return "American Express";
    if (/^6(011|4[4-9]|5|22)/.test(sanitized)) return "Discover";
    return ""; // No coincide
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.concept || formData.concept.length > 100) {
      errors.concept = "Concepto es obligatorio";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "El monto debe ser mayor a cero.";
    }
    if (
      !formData.nroTarjeta 
    ) {
      errors.nroTarjeta = "La factura es obligatoria.";
    }
    if (!formData.currency) {
      errors.currency = "Moneda es obligatoria.";
    }
    if (!formData.description) {
      errors.description = "Descripción es obligatoria.";
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

    const formToSend = {
      concept: formData.concept,
      nroTarjeta: formData.nroTarjeta,
      amount: parseFloat(formData.amount.replace(/\./g, "").replace(",", ".")),
      currency: formData.currency,
      description: formData.description,
    };

    setLoading(true);
    try {
      await api.post("/transactions/payment", formToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarMessage("Pago registrado exitosamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setFormData(initialPaymentData);
      navigate("/home", {
        state: {
          success: true,
          deposit: false,
          FixedTermDeposit: false,
          Payment: true,
        },
      });
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

  const handleClose = () => {
    navigate("/home");
  };

  const cardStyle = {
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9CD99E",
    width: "700px",
  };

  const inputStyles = {
    textAlign: "left",
  };

  return (
    <div>
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
            <Grid
              container
              spacing={2}
              p={2}
              justifyContent="center"
            >
              <Grid size={12}>
                <TextField
                  fullWidth
                  name="nroTarjeta"
                  label="Número de factura"
                  type="text"
                  variant="outlined"
                  value={formData.nroTarjeta}
                  onChange={handleChange}
                  error={!!error.nroTarjeta}
                  helperText={error.nroTarjeta}
                />
              </Grid>

              <Grid item size={5}>
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  name="amount"
                  label="Monto"
                  variant="outlined"
                  value={formData.amount}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
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
                  sx={inputStyles}
                  value={formData.currency}
                  onChange={handleChange}
                  error={!!error.currency}
                  helperText={error.currency}
                >
                  <MenuItem value="ARS">ARS</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </TextField>
              </Grid>
              <Grid item size={3}>
                <TextField
                  fullWidth
                  name="concept"
                  label="Concepto"
                  select
                  sx={inputStyles}
                  variant="outlined"
                  value={formData.concept}
                  onChange={handleChange}
                  error={!!error.concept}
                  helperText={error.concept}
                >
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
                  label="Descripción"
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!error.description}
                  helperText={error.description}
                />
              </Grid>

              <Grid
                item
                container
                justifyContent="space-between"
                spacing={2}
                mt={2}
              >
                <Grid item xs={6}>
                  <Button
                    sx={{
                      padding: "5px 30px",
                      borderRadius: "25px",
                      fontWeight: "bold",
                      backgroundColor: "#FF6666",
                      "&:hover": {
                        backgroundColor: "#FF5252",
                      },
                    }}
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                    fullWidth
                  >
                    Cancelar
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      padding: "5px 30px",
                      borderRadius: "25px",
                      fontWeight: "bold",
                      backgroundColor: "#9cd99e",
                      "&:hover": {
                        backgroundColor: "#388E3C",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Pagar"
                    )}
                  </Button>
                </Grid>
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
        loading={loading}
      />
    </div>
  );
};

export default PaymentForm;