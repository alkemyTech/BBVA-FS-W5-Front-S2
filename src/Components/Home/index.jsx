import {
  Dialog,
  Tooltip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Icon,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Card,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import IconButton from "@mui/material/IconButton";
import PlazosFijos from "../../assets/img/Plazos Fijos.jpg";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import { useNavigate, useLocation } from "react-router-dom";
import Notification from "../Notification/Notification";
import { NumericFormat } from "react-number-format";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Graphics from "../Material UI/Graphics";

const initialFormData = {
  newTransactionLimit: "",
};

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fixedTerms, setFixedTerms] = useState([]);
  const [showBalance, setBalance] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    transactionLimit: "",
  });

  const openConfirmDialog = (id) => {
    setSelectedAccount(id);
    setOpenDialog(true);
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericValue = parseFloat(value.replace(/\./g, "").replace(",", "."));

    setFormData((prev) => ({
      ...prev,
      newTransactionLimit: isNaN(numericValue) ? 0.0 : numericValue,
    }));
  };

  const handleClickShowBalance = () => setBalance((show) => !show);

  const handleMouseDownBalance = (event) => {
    event.preventDefault();
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token no encontrado");
        window.location.href = "/";
        return;
      }

      const response = await api.get("/transactions/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = "/";
      }
    }
  };

  const editLimit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formToSend = {
        accountId: parseInt(selectedAccount),
        newTransactionLimit: formData.newTransactionLimit,
      };

      const response = await api.post("/accounts/editLimit", formToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setSnackbarMessage("Ya cambiaste tu limite!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDialog(false);
      fetchAccounts();
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response
        ? error.response.data.message
        : "Error desconocido";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchFixedTerms = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token no encontrado");
        window.location.href = "/";
        return;
      }

      const response = await api.get("/fixed-term-deposits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Datos obtenidos:", response.data);
      setFixedTerms(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = "/";
      }
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token no encontrado");
        window.location.href = "/";
        return;
      }

      const response = await api.get("/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Datos obtenidos:", response.data);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = "/";
      }
    }
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

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    fetchFixedTerms();
  }, []);

  useEffect(() => {
    if (location.state?.FixedTermDeposit) {
      setSnackbarMessage("Plazo fijo creado con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
    if (location.state?.deposit) {
      setSnackbarMessage("Depósito realizado con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
    if (location.state?.Payment) {
      setSnackbarMessage("Pago registrado exitosamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    }
  }, [location.state]);

  const cardStyle = {
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };

  const buttons = {
    backgroundColor: "#9cd99e",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#2b6a2f",
    fontWeight: "bold",
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

  const cardContentStyle = {
    paddingTop: "6px",
    "&:last-child": {
      paddingBottom: "6px",
    },
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid className="cardsssss" item size={8}>
          <Grid container>
            {accounts.map((account) => (
              <Grid item size={accounts.length === 1 ? 12 : 6} key={account.id}>
                <Card sx={cardStyle}>
                  <CardHeader
                    sx={{ textAlign: "left", paddingBottom: "4px" }}
                    action={
                      <Tooltip title={`CBU: ${account.cbu}`} arrow>
                        <IconButton aria-label="settings">
                          <BadgeOutlinedIcon
                            sx={{ color: "#2b6a2f", fontSize: "1.5rem" }}
                          />
                        </IconButton>
                      </Tooltip>
                    }
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
                    subheader={
                      <Grid
                        item
                        size={12}
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Typography>
                          {`Límite de transacción $${formatCurrency(
                            account.transactionLimit,
                            account.currency
                          )}`}
                        </Typography>
                        <IconButton
                          onClick={() => openConfirmDialog(account.id)}
                        >
                          <EditIcon sx={{ fontSize: "medium" }} />
                        </IconButton>
                      </Grid>
                    }
                  />
                  <CardContent sx={{ paddingTop: "4px" }}>
                    <Grid container>
                      <Grid item size={12}>
                        <Typography
                          sx={{
                            fontSize: "1.25rem",
                            color: "#3A3A3A",
                            marginBottom: "8px",
                            textAlign: "left",
                          }}
                        >
                          Dinero disponible
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        size={7}
                        sx={{ display: "flex", textAlign: "left" }}
                      >
                        <Typography
                          sx={{
                            fontSize: "2rem",
                            color: "#000000",
                            fontWeight: "bold",
                          }}
                        >
                          {showBalance
                            ? `$ ${formatCurrency(
                                account.balance,
                                account.currency
                              )}`
                            : "****"}
                        </Typography>
                        <IconButton
                          sx={{ color: "#43A047" }}
                          aria-label={
                            showBalance ? "hide balance" : "show balance"
                          }
                          onClick={handleClickShowBalance}
                          onMouseDown={handleMouseDownBalance}
                          edge="end"
                        >
                          {showBalance ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      variant="body2"
                      sx={buttons}
                      onClick={() => navigate("/Transacciones")}
                    >
                      Transferir
                    </Button>
                    <Button
                      variant="body1"
                      sx={buttons}
                      onClick={() => navigate(`/depositar/${account.cbu}`)}
                    >
                      Depositar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Grid item size={6}>
              <Card style={{ ...cardStyle, minHeight: "500px" }}>
                <CardHeader
                  style={{ textAlign: "center", paddingBottom: "0px" }}
                  title={
                    <Typography
                      style={{
                        fontSize: "1.35rem",
                        color: "#2b6a2f",
                        fontWeight: "bold",
                      }}
                    >
                      Gastos mensuales
                    </Typography>
                  }
                />
                <CardContent sx={cardContentStyle}>
                  <Graphics />
                </CardContent>
              </Card>
            </Grid>
            <Grid item size={6}>
              <Card style={{ ...cardStyle, minHeight: "500px" }}>
                <CardHeader
                  style={{ textAlign: "center" }}
                  title={
                    <Typography
                      style={{
                        fontSize: "1.35rem",
                        color: "#2b6a2f",
                        fontWeight: "bold",
                      }}
                    >
                      Plazos fijos
                    </Typography>
                  }
                />
                <CardContent sx={cardContentStyle}>
                  {fixedTerms.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                padding: "8px",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.90rem",
                              }}
                            >
                              CBU
                            </TableCell>
                            
                            <TableCell
                              sx={{
                                padding: "8px",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.90rem",
                              }}
                            >
                              Fecha
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.90rem",
                              }}
                            >
                              Estado
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.90rem",
                              }}
                            >
                              Liquidacion
                            </TableCell>

                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fixedTerms.slice(0, 7).map((fixedTerm, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                cursor: "pointer",
                                "&:hover": {
                                  borderRight: "4px solid #9cd99e",
                                  backgroundColor: "#f5f5f5",
                                },
                              }}
                            >
                              <TableCell
                                sx={{ padding: "12px", textAlign: "center" }}
                              >
                                <Tooltip
                                  title={` CBU ${fixedTerm.accountCBU}`}
                                  arrow
                                >
                                  <Typography sx={{ fontSize: "0.85rem" }}>
                                    {" "}
                                    {`... ${fixedTerm.accountCBU.slice(
                                      -4
                                    )}`}{" "}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "12px",
                                  textAlign: "center",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {new Date(fixedTerm.endDate).toLocaleString(
                                  "es-ES",
                                  { dateStyle: "medium" }
                                )}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "12px",
                                  textAlign: "center",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {fixedTerm.processed ? "Acreditado" : "En curso"}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "12px",
                                  textAlign: "center",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {" "}
                                {`$ ${
                                  fixedTerm.amount + fixedTerm.interestRate
                                }`}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography
                      style={{
                        fontSize: "1rem",
                        color: "#3A3A3A",
                        textAlign: "center",
                      }}
                    >
                      Aquí aparecerán tus plazos fijos
                    </Typography>
                  )}
                  <CardActions
                    sx={{ display: "flex", justifyContent: "center", alignItems:"center" }}
                  >
                    <Button sx={buttons}> Ver mas</Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={4} >
          <Card style={{ ...cardStyle,  minHeight: "768px" }}>
            <CardHeader
              sx={{ display: "flex", textAlign: "center" }}
              title={
                <Typography
                  sx={{
                    fontSize: "1.35rem",
                    color: "#2b6a2f",
                    fontWeight: "bold",
                  }}
                >
                  Últimos movimientos
                </Typography>
              }
            />
            <CardContent sx={cardContentStyle}>
              {transactions.length > 0 ? (
                <Grid container spacing={1}>
                  {transactions.slice(0, 9).map((transaction, index) => (
                    <Grid
                      item
                      size={12}
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          cursor: "pointer",
                          borderLeft:
                            transaction.type === "Pago"
                              ? "4px solid #FF6666"
                              : "4px solid #9cd99e",
                        },
                      }}
                    >
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 12px",
                          justifyContent: "space-around",
                        }}
                      >
                        <Grid item size={2}>
                          {transaction.type === "Depósito" && (
                            <ArrowCircleUpRoundedIcon
                              sx={{ fontSize: "36px", color: "#43A047" }}
                            />
                          )}
                          {transaction.type === "Ingreso" && (
                            <ArrowCircleUpRoundedIcon
                              sx={{ fontSize: "36px", color: "#43A047" }}
                            />
                          )}
                          {transaction.type === "Pago" && (
                            <ArrowCircleDownRoundedIcon
                              sx={{ fontSize: "36px", color: "#FF0000" }}
                            />
                          )}
                        </Grid>
                        <Grid item size={10}>
                          <Grid container>
                            <Grid item size={6}>
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  color: "#000000",
                                  fontSize: "1rem",
                                  textAlign: "left",
                                }}
                              >
                                {transaction.type === "Pago" ||
                                transaction.type === "Depósito"
                                  ? `${
                                      transaction.accountDestino?.firstName ||
                                      transaction.accountOrigen?.firstName
                                    } ${
                                      transaction.accountDestino?.lastName ||
                                      transaction.accountOrigen?.lastName
                                    }`
                                  : `${
                                      transaction.accountOrigen?.firstName || ""
                                    } ${
                                      transaction.accountOrigen?.lastName || ""
                                    }`}
                              </Typography>
                            </Grid>
                            <Grid item size={6} sx={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  color: "#000000",
                                  fontSize: "1rem",
                                }}
                              >
                                {transaction.type === "Pago"
                                  ? `- $${formatCurrency(
                                      transaction.amount,
                                      transaction.accountDestino?.currency ||
                                        transaction.accountOrigen?.currency
                                    )} ${
                                      transaction.accountDestino?.currency ||
                                      transaction.accountOrigen?.currency
                                    }`
                                  : `+ $${formatCurrency(
                                      transaction.amount,
                                      transaction.accountDestino?.currency ||
                                        transaction.accountOrigen?.currency
                                    )} ${
                                      transaction.type === "Ingreso"
                                        ? transaction.accountOrigen?.currency ||
                                          ""
                                        : transaction.accountDestino
                                            ?.currency || ""
                                    }`}
                              </Typography>
                            </Grid>

                            <Grid item size={6}>
                              <Typography sx={{ textAlign: "left" }}>
                                {transaction.concept}
                              </Typography>
                            </Grid>
                            <Grid item size={6} sx={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {new Date(transaction.timestamp).toLocaleString(
                                  "es-ES",
                                  {
                                    timeStyle: "short",
                                  }
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#3A3A3A",
                    textAlign: "center",
                  }}
                >
                  Aquí aparecerán tus transacciones
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar límite de transacción</DialogTitle>
        <DialogContent>
          <form>
            <NumericFormat
              fullWidth
              label="Nuevo límite de transacción"
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              customInput={TextField}
              value={form.transactionLimit}
              variant="outlined"
              onChange={handleChange}
              slotProps={{}}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "20px" },
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenDialog(false)}
            sx={deleteButtonStyles}
          >
            Cancelar
          </Button>
          <Button onClick={editLimit} sx={buttons}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

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
