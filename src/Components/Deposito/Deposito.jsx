import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import Grid from "@mui/material/Grid2";
import Notification from "../Notification/Notification";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function TransactionForm() {
  const { cbu } = useParams();
  const [form, setForm] = useState({
    cbu: cbu,
    amount: "",
    description: "",
    concept: "",
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const concepts = [
    "Servicios",
    "Salud",
    "Transporte",
    "Alquiler",
    "Comida",
    "Otros",
    "Deposito",
  ];

  const buttons = {
    backgroundColor: "#9cd99e", // Verde claro
    borderRadius: "25px",
    padding: "10px 20px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    width: "100%",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#2B6A2F", // Hover más oscuro
      color: "#FFFFFF",
    },
  };
  
  const closeButton = {
    backgroundColor: "#FF6666", // Rojo claro
    borderRadius: "25px",
    padding: "10px 20px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#FF5252", // Hover más oscuro
      color: "#FFFFFF",
    },
  };
  

  const cardStyle = {
    margin: "20px auto",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #4CAF50", // Color de la barra superior
    padding: 3,
    maxWidth: 600,
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#fff",
    marginTop: "40px",
  };

  const inputStyles = {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "16px",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  };

  const labelStyles = {
    fontWeight: "bold",
    color: "#333",
  };

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.amount) newErrors.amount = "Monto es obligatorio";
    if (!form.description) newErrors.description = "Descripción es obligatoria";
    if (!form.concept) newErrors.concept = "Concepto es obligatorio";
    return newErrors;
  };

  const sendForm = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage("No se encontró el token de autenticación.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      await api.post(
        `/transactions/deposit/${form.cbu}`,
        {
          amount: parseFloat(form.amount.replace(/\./g, "").replace(",", ".")),
          description: form.description,
          concept: form.concept,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbarMessage("Depósito enviado con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setForm({ ...form, amount: "", description: "", concept: "" });
      navigate("/home");
    } catch (error) {
      console.error("Error al realizar el depósito:", error);
      setSnackbarMessage("Error al enviar el depósito");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <Card sx={cardStyle}>
      <Typography
        variant="h5"
        gutterBottom
        style={{
          fontSize: "1.35rem",
          color: "#2B6A2F",
          fontWeight: "bold",
        }}
      >
        Realizar Depósito
      </Typography>
      <form onSubmit={sendForm}>
      <Grid
  container
  direction="column"
  justifyContent="center"
  alignItems="stretch"
  spacing={3} // Espaciado uniforme entre los campos
  p={2}
>
  {/* CBU */}
  <Grid item>
    <TextField
      fullWidth
      label="CBU"
      value={form.cbu}
      InputProps={{ readOnly: true }}
      InputLabelProps={{ style: labelStyles }}
      sx={inputStyles}
    />
  </Grid>

  {/* Monto */}
  <Grid item>
    <NumericFormat
      customInput={TextField}
      fullWidth
      label="Monto"
      value={form.amount}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      onChange={(e) => setForm({ ...form, amount: e.target.value })}
      error={!!errors.amount}
      helperText={errors.amount}
      sx={inputStyles}
    />
  </Grid>

  {/* Concepto */}
  <Grid item>
    <FormControl fullWidth error={!!errors.concept} sx={inputStyles}>
      <InputLabel id="concept-label" style={labelStyles}>
        Concepto
      </InputLabel>
      <Select
        labelId="concept-label"
        value={form.concept}
        onChange={(e) => setForm({ ...form, concept: e.target.value })}
      >
        {concepts.map((concept) => (
          <MenuItem key={concept} value={concept}>
            {concept}
          </MenuItem>
        ))}
      </Select>
      {errors.concept && (
        <Typography variant="caption" color="error">
          {errors.concept}
        </Typography>
      )}
    </FormControl>
  </Grid>

  {/* Descripción */}
  <Grid item>
    <TextField
      fullWidth
      label="Descripción"
      value={form.description}
      onChange={(e) =>
        setForm({ ...form, description: e.target.value })
      }
      error={!!errors.description}
      helperText={errors.description}
      sx={inputStyles}
    />
  </Grid>

  {/* Botones */}
  <Grid 
    item 
    container 
    justifyContent="space-between" 
    spacing={2} 
    mt={2}
  >
    <Grid item xs={6}>
      <Button
        sx={{ ...buttons }}
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
      >
        Depositar
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button
        sx={{ ...closeButton }}
        variant="contained"
        color="secondary"
        onClick={handleClose}
        fullWidth
      >
        Cancelar
      </Button>
    </Grid>
  </Grid>
</Grid>

      </form>

      {/* Notificación */}
      <Notification
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        setOpenSnackbar={setOpenSnackbar}
      />
    </Card>
  );
}