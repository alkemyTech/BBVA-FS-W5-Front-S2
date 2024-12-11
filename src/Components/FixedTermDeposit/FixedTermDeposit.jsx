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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import CardHeader from "@mui/material/CardHeader";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { NumericFormat } from "react-number-format";
import api from "../../services/Api";
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
    if (!formData.amount) {
      errors.amount = "El monto es obligatorio";
    }
    if (!formData.days) {
      errors.days = "Los días son obligatorios";
    }
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
      setSnackbarMessage("Simulación finalizada");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
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
      setSnackbarMessage("Simulación finalizada");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      navigate("/home", { state: { success: true } });
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
    setIsSimulated(false); // Restablecer la simulación
    setFormData(initialFormData);
    setIsSelectedAccount(false);
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
          <Typography variant="h4" align="center" class="form-title">
            Crear Plazo Fijo
          </Typography>

          <Grid
            container
            spacing={3}
            sx={{
              marginTop: "10px",
              marginBottom: "20px",
              justifyContent: "center",
            }}
          >
            {accounts.map((account) => (
              <Grid item xs={12} sm={6} md={4} key={account.id}>
                <Card sx={cardStyle(account.id === selectedAccount?.id)}>
                  <CardHeader
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                    title={
                      <Typography
                        sx={{
                          fontSize: "1.35rem",
                          color: "#2b6a2f",
                          fontWeight: "bold",
                        }}
                      >
                        {`Cuenta en ${account.currency}`}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: "1.25rem",
                        color: "#3A3A3A",
                        marginBottom: "8px",
                      }}
                    >
                      CBU
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "2rem",
                        color: "#000000",
                        fontWeight: "bold",
                      }}
                    >
                      {account.cbu}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1.25rem",
                        color: "#3A3A3A",
                        marginBottom: "8px",
                      }}
                    >
                      Dinero disponible
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "2rem",
                        color: "#000000",
                        fontWeight: "bold",
                      }}
                    >
                      ${account.balance}
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
                        padding: "15px 35px",
                        borderRadius: "25px",
                        fontWeight: "bold",
                        backgroundColor: "#43A047",
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
                      marginTop: "20px",
                      background: "#43A047",
                      padding: "15px 35px",
                      borderRadius: "25px",
                      fontWeight: "bold",
                    }}
                    disabled={isSimulated || !formData.amount || !formData.days}
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
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
              <Card sx={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
                <CardHeader
                  title={
                    <Typography variant="h6" align="center">
                      Resultado de Simulación de Plazo Fijo
                    </Typography>
                  }
                  sx={{ backgroundColor: "#f4f4f4" }}
                />
                <CardContent>
                  <Typography>
                    <strong>Monto:</strong> {simulatedData.amount}
                  </Typography>
                  <Typography>
                    <strong>Interés:</strong> {simulatedData.interestRate}
                  </Typography>
                  <Typography>
                    <strong>Total a acreditarse:</strong> {simulatedData.total}
                  </Typography>
                  <Typography>
                    <strong>Cuenta a acreditarse:</strong>{" "}
                    {simulatedData.accountCBU}
                  </Typography>
                  <Typography>
                    <strong>Fecha de inicio:</strong>{" "}
                    {formatDate(simulatedData.startDate)}
                  </Typography>
                  <Typography>
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
                        sx={{
                          padding: "15px 35px",
                          borderRadius: "25px",
                          fontWeight: "bold",
                          backgroundColor: "#e53935",
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                          },
                        }}
                      >
                        Cancelar
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCreateFixedTerm}
                        sx={{
                          padding: "15px 35px",
                          borderRadius: "25px",
                          fontWeight: "bold",
                          backgroundColor: "#43A047",
                          "&:hover": {
                            backgroundColor: "#388E3C",
                          },
                        }}
                      >
                        Crear Plazo Fijo
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </Box>
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
