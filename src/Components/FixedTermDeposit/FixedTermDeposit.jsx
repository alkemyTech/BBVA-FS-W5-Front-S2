import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { NumericFormat } from "react-number-format";
import api from "../../services/api";
import "./FixedTermDeposit.css";
import Notification from "../Notification/Notification";
import dayjs from "dayjs";

const initialFormData = {
  amount: "0.00",
  days: "",
  cbu: "",
};

const FixedTermDepositForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [simulatedData, setSimulatedData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isSelectedAccount, setIsSelectedAccount] = useState(false);
  const token = localStorage.getItem("token");
  const today = dayjs();
  const minDate = today.add(30, "day");

  if (!token) {
    console.error("Token no encontrado");
    window.location.href = "/";
    return;
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccounts(response.data);
      } catch (err) {
        console.error("Error al obtener las cuentas:", err);
      }
    };
    fetchAccounts();
  }, [token]);

  const cardStyle = (isSelected) => ({
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: `4px solid ${isSelected ? "#43A047" : "#9cd99e"}`,
    backgroundColor: isSelected ? "#d3f9d8" : "white",
  });

  const buttonStyles = {
    background: "#9cd99e",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#9CD99E",
      color: "#FFFFFF",
    },
  };

  const deleteButtonStyles = {
    background: "#FF6666",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#FF5252",
      color: "#FFFFFF",
    },
  };

  const formatCurrency = (amount, currency) => {
    if (amount == null || currency == null) {
      return "$ 0.00";
    }
    const validCurrency = currency || "USD";
    try {
      return `${new Intl.NumberFormat("en-US").format(amount)}`;
    } catch (error) {
      console.error("Error formateando la moneda:", error);
      return "$0.00";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "days") {
      const selectedDate = dayjs(value);
      const today = dayjs();
      const difference = selectedDate.diff(today, "day") + 1;

      setFormData((prev) => ({
        ...prev,
        selectedDaysCount: difference,
        days: value,
      }));
    } else if (name === "amount") {
      const numericValue = parseFloat(
        value.replace(/\./g, "").replace(",", ".")
      );

      setFormData((prev) => ({
        ...prev,
        amount: isNaN(numericValue) ? 0.0 : numericValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setFormData({ ...formData, cbu: account.cbu });
    setIsSelectedAccount(true);
  };

  const validate = () => {
    const errors = {};

    // Validar monto
    if (!formData.amount || parseFloat(formData.amount) === 0) {
      errors.amount = "Debe ingresar un monto";
    }

    // Validar fecha de fin
    if (!formData.days) {
      errors.days = "La fecha de fin es obligatoria";
    }

    // Validar cuenta seleccionada
    if (!formData.cbu) {
      errors.cbu = "Debe seleccionar una cuenta";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = {
      amount: formData.amount,
      cbu: formData.cbu,
      days: formData.selectedDaysCount,
    };

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/fixed-term-deposits/fixedTerm/simulate",
        formToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSimulatedData(response.data);
      setIsSimulated(true);
      setShowConfirmation(true);
      setLoading(false);
      setOpen(true);
    } catch (err) {
      console.error("Error al realizar la solicitud:", err.response || err);
      setLoading(false);
      const errorMessage = err.response
        ? err.response.data.message
        : "No se pudo conectar al servidor. Intente nuevamente.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCreateFixedTerm = async () => {
    try {
      const formToSend = {
        amount: formData.amount,
        cbu: formData.cbu,
        days: formData.selectedDaysCount,
      };

      await api.post("/fixed-term-deposits/fixedTerm", formToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData(initialFormData);
      navigate("/home", { state: { success: true, deposit: false, FixedTermDeposit: true, Payment: false } });
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message
        : "No se pudo conectar al servidor. Intente nuevamente.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSimulatedData(null);
    setIsSimulated(false);
    setOpen(false);
  };

  function formatDate(dateString) {
    const datePart = dateString.split("T")[0];
    const partesFecha = datePart.split("-");

    return `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
  }

  return (
    <div>
      <Grid container spacing={3} direction="column" class="grid-container">
        <Grid item class="grid-item">
          <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            sx={{ color: "#2B6A2F", fontWeight: "bold" }}
          >
            Crear Plazo Fijo
          </Typography>

          <Grid
            container
            spacing={3}
            sx={{
              justifyContent: "center",
            }}
          >
            {accounts.map((account) => (
              <Grid item xs={12} sm={6} md={4} key={account.id}>
                <Card
                  sx={{
                    ...cardStyle(
                      isSelectedAccount && account.id === selectedAccount?.id
                    ),
                    maxWidth: "350px",
                  }}
                >
                  <CardHeader
                    title={
                      <Typography
                        variant="h7"
                        textAlign="center"
                        sx={{ color: "#2B6A2F", fontWeight: "bold" }}
                      >
                        {`Cuenta en ${account.currency}`}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      <strong>CBU:</strong> {account.cbu}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Dinero disponible:</strong> $
                      {formatCurrency(account.balance, account.currency)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color={
                        account.id === selectedAccount?.id && isSelectedAccount
                          ? "disabled"
                          : "primary"
                      }
                      fullWidth
                      onClick={() => handleAccountSelect(account)}
                      disabled={
                        account.id === selectedAccount?.id && isSelectedAccount
                      }
                      sx={{
                        padding: "5px 10px",
                        borderRadius: "25px",
                        fontWeight: "bold",
                        backgroundColor: "#9cd99e",
                        "&:hover": {
                          backgroundColor: "#388E3C",
                        },
                      }}
                    >
                      {isSelectedAccount && account.id === selectedAccount?.id
                        ? "Cuenta Seleccionada"
                        : "Seleccionar"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {isSelectedAccount && (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12}>
                  <NumericFormat
                    fullWidth
                    name="amount"
                    label="Monto"
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    customInput={TextField}
                    variant="outlined"
                    value={formData.amount}
                    onChange={handleChange}
                    error={!!error.amount}
                    helperText={error.amount}
                    disabled={isSimulated}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBalanceIcon sx={{ color: "#43A047" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="days"
                    label="Fecha de fin"
                    type="date"
                    variant="outlined"
                    value={formData.days}
                    onChange={handleChange}
                    onFocus={(e) => e.target.showPicker()}
                    error={!!error.days}
                    helperText={error.days}
                    disabled={isSimulated}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon sx={{ color: "#43A047" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    inputProps={{
                      min: minDate.format("YYYY-MM-DD"),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "20px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
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
                    disabled={
                      isSimulated ||
                      !formData.amount ||
                      parseFloat(formData.amount) === 0 ||
                      !formData.days
                    }
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Simular"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          {showConfirmation && (
            <Dialog open={open} onClose={handleCancel} maxWidth="md">
              <DialogTitle sx={{ color: "#2B6A2F", fontWeight: "bold" }}>
                Resultado de Simulación de Plazo Fijo
              </DialogTitle>
              <DialogContent>
                <Card sx={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Monto:</strong>{" "}
                      {simulatedData.amount.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Interés:</strong> {simulatedData.interestRate.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total a acreditarse:</strong>{" "}
                      {simulatedData.total.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Cuenta a acreditarse:</strong>{" "}
                      {simulatedData.accountCBU}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha de inicio:</strong>{" "}
                      {formatDate(simulatedData.startDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha de finalización:</strong>{" "}
                      {formatDate(formData.days)}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "16px",
                    }}
                  >
                    <Grid
                      container
                      spacing={3}
                      justifyContent="center"
                      sx={{ width: "100%" }}
                    >
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          onClick={handleCancel}
                          sx={deleteButtonStyles}
                        >
                          Cancelar
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleCreateFixedTerm}
                          sx={buttonStyles}
                        >
                          Crear
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </DialogContent>
            </Dialog>
          )}
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
};

export default FixedTermDepositForm;
