import {
  Dialog,
  Tooltip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Card, Typography, CardHeader, CardContent,CardActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fixedTerms, setFixedTerms] = useState([]);
  const [showBalance, setBalance] = useState(false);

  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    fetchFixedTerms();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      setSnackbarMessage("Plazo fijo creado con éxito");
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


  

  const cardContentStyle = {
    paddingTop: "6px",
    "&:last-child": {
      paddingBottom: "6px",
    },
  };

  
  return (
    <div>
      <Grid container spacing={4}>
        <Grid className="cardsssss" item size={8}>
          <Grid container>
            {accounts.map((account) => (
              <Grid item size={accounts.length === 1 ? 12 : 6} key={account.id}>
                <Card sx={cardStyle}>
                  <CardHeader sx={{textAlign:"left"}}
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
                  />
                  <CardContent>
                    <Grid container>
                      <Grid item size={12}>
                        <Typography
                          sx={{
                            fontSize: "1.25rem",
                            color: "#3A3A3A",
                            marginBottom: "8px",
                            textAlign:"left"
                          }}
                        >
                          Dinero disponible
                        </Typography>
                      </Grid>
                      <Grid item size={7} sx={{display:"flex", textAlign: "left" }}>
                        <Typography
                          sx={{
                            fontSize: "2rem",
                            color: "#000000",
                            fontWeight: "bold",
                          }}
                        >
                          {showBalance ? `$ ${account.balance}` : "****"}
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
                  <CardActions sx={{display:"flex",justifyContent:"center",textAlign:"center"}}>
                    <Button variant="body2" sx={buttons} onClick={() => navigate("/Transacciones")}>
                      Transferir
                    </Button>
                    <Button variant="body1" sx={buttons}>
                      Depositar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <Grid item size={6}>
              <Card style={cardStyle}>
                <CardHeader
                  style={{textAlign: "center" }}
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
                            <TableCell sx={{padding:"8px", textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>
                              CBU
                            </TableCell>
                            <TableCell sx={{padding:"8px", textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>
                              Acreditacion
                            </TableCell>
                            <TableCell sx={{padding:"8px", textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>
                              Monto 
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fixedTerms.slice(0, 3).map((fixedTerm, index) => (
                            <TableRow key={index} sx={{cursor: "pointer",
                              "&:hover": {
                                borderRight: "4px solid #9cd99e",
                                backgroundColor:"#f5f5f5"
                              },}}>
                              
                              <TableCell sx={{padding:"12px", textAlign: "center",}}>
                                <Tooltip title={` CBU ${fixedTerm.accountCBU}`} arrow>
                                    <Typography sx={{fontSize: "0.85rem"}}> {`... ${fixedTerm.accountCBU.slice(-4)}`} </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={{padding:"12px", textAlign: "center",fontSize: "0.85rem" }}>
                                {new Date(fixedTerm.endDate).toLocaleString(
                                  "es-ES",
                                  { dateStyle: "medium" }
                                )}
                              </TableCell>
                              <TableCell sx={{padding:"12px", textAlign: "center",fontSize: "0.85rem" }}>  {`$ ${fixedTerm.amount + fixedTerm.interestRate}`}
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
                        marginTop: "20px",
                      }}
                    >
                      Aquí aparecerán tus plazos fijos
                    </Typography>
                  )}
                  <CardActions sx={{display:"flex", justifyContent:"center"}}>
                    <Button sx={buttons}> Ver mas</Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          <Grid item size={6}>
              <Card style={cardStyle}>
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
                            <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>
                              CBU
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>
                              Fecha de fin
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>
                              Monto ingresado
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fixedTerms.slice(0, 5).map((fixedTerm, index) => (
                            <TableRow key={index}>
                              <TableCell>{fixedTerm.accountCBU}</TableCell>
                              <TableCell>
                                {new Date(fixedTerm.endDate).toLocaleString(
                                  "es-ES",
                                  { dateStyle: "medium" }
                                )}
                              </TableCell>
                              <TableCell>{`$ ${fixedTerm.amount}`}</TableCell>
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
                        marginTop: "20px",
                      }}
                    >
                      Aquí aparecerán tus plazos fijos
                    </Typography>
                  )}
                  <Grid
                    item
                    size={12}
                    justifyContent="center"
                    style={{ marginTop: 16 }}
                  >
                    <Button style={buttons}>Ver más</Button>
                  </Grid>
                </CardContent>
              </Card>
          </Grid>
          </Grid>
        </Grid>
        <Grid size={4}>
          <Card sx={cardStyle}>
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
                  {transactions.slice(0, 8).map((transaction, index) => (
                    <Grid item size={12} key={index}>
                      <Grid item size={12}>
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
                            {transaction.type === "Deposito" && (
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
                                  }}
                                >
                                  {transaction.type === "Pago" ||
                                  transaction.type === "Deposito"
                                    ? `${
                                        transaction.accountDestino?.firstName || ""
                                      } ${
                                        transaction.accountDestino?.lastName || ""
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
                                    ? `- $${transaction.amount} ${
                                        transaction.accountDestino?.currency || ""
                                      }`
                                    : `+ $${transaction.amount} ${
                                        transaction.type === "Ingreso"
                                          ? transaction.accountOrigen?.currency || ""
                                          : transaction.accountDestino?.currency || ""
                                      }`}
                                </Typography>
                              </Grid>

                              <Grid item size={6}>
                                <Typography>{transaction.concept}</Typography>
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
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#3A3A3A",
                    textAlign: "center",
                    marginTop: "20px",
                  }}
                >
                  Aquí aparecerán tus transacciones
                </Typography>
              )}
            </CardContent>  
          </Card>
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