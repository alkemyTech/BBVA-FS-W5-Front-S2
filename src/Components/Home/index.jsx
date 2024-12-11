import { Dialog, Tooltip, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'; 
import Grid from '@mui/material/Grid2';
import { Typography, Card, CardContent, Box, TableHead, InputAdornment,} from "@mui/material";
import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import PlazosFijos from "../../assets/img/Plazos Fijos.jpg";
import CardMedia from '@mui/material/CardMedia';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import { useNavigate, useLocation } from "react-router-dom";
import Notification from "../Notification/Notification";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



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

  const handleClickShowBalance = () => setBalance((show) => !show);

  const handleMouseDownBalance = (event) => {
    event.preventDefault();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token no encontrado");
        window.location.href = "/";
        return;
      }

      const response = await api.get("/transactions/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token no encontrado");
        window.location.href = "/";
        return;
      }

      const response = await api.get("/fixed-term-deposits", {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token no encontrado");
        window.location.href = "/";
        return;
      }

      const response = await api.get("/accounts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
    margin: "8px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };

  const cardFixedTermStyle = {
    borderRadius: "5px",
    margin: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderBottom: "4px solid #9cd99e",
  };

  const buttons = {
    backgroundColor: "#9cd99e",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#2b6a2f",
    fontWeight: "bold",
  };

  

  return (
    <div>
      <Grid container spacing={4} sx={{ margin:"30px", p: 1 }}>
        <Grid className="cardsssss" item size={9}>
          <Grid container>
            {accounts.map((account) => (
              <Grid item size={6} key={account.id}>
                <Card sx={cardStyle}>
                  <CardHeader
                    action={
                      <Tooltip title={`CBU: ${account.cbu}`} arrow>
                        <IconButton aria-label="settings">
                          <BadgeOutlinedIcon sx={{ color: "#2b6a2f", fontSize: "1.5rem" }} />
                        </IconButton>
                      </Tooltip>
                    }
                   
                    title={
                      <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}>
                        {`Cuenta en ${account.currency}`}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Grid container>
                      <Grid item size={12}>
                        <Typography sx={{ fontSize: "1.25rem", color: "#3A3A3A", marginBottom: "8px" }}>
                          Dinero disponible
                        </Typography>
                      </Grid>
                      <Grid item size={4}  sx={{textAlign:"center"}}>
                        <Typography
                          sx={{ fontSize: "2rem", color: "#000000", fontWeight: "bold" }}
                        >
                          {showBalance ? `$${account.balance}` : "****"}
                        </Typography>
                      </Grid>
                      <Grid item size={2} >
                        <IconButton
                          sx={{ color: "#43A047" }}
                          aria-label={showBalance ? "hide balance" : "show balance"}
                          onClick={handleClickShowBalance}
                          onMouseDown={handleMouseDownBalance}
                          edge="end"
                        >
                          {showBalance ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid container size={12} sx={{ gap: 2, textAlign: "center", marginTop: 2, padding: "10px", justifyContent: "center" }}>
                    <Grid item size={5}>
                      <Typography variant="body2" fullWidth sx={buttons}>Depositar</Typography>
                    </Grid>
                    <Grid item size={5}>
                      <Typography variant="body2" sx={buttons}>Transferir</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid container>
            <Grid item size={12}>
              <Card style={cardStyle}>
                <CardHeader
                  style={{ textAlign: "center" }}
                  title={
                    <Typography style={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}>
                      Plazos fijos
                    </Typography>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    {fixedTerms.slice(0, 5).map((fixedTerm, index) => (
                      <Grid item size={12} key={index}>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            padding: "8px",
                            borderRadius: "8px",
                            alignItems: "center",
                          }}
                        >
                          <Grid item size={4}>
                            <Typography style={{ fontWeight: "bold", color: "#000", fontSize: "1rem" }}>
                              Plazo fijo {index + 1}
                            </Typography>
                            <Typography style={{ color: "#3A3A3A", fontSize: "0.85rem" }}>
                              CBU: {fixedTerm.accountCBU}
                            </Typography>
                          </Grid>
                          <Grid item size={4} style={{ textAlign: "center" }}>
                            <Typography style={{ fontSize: "0.90rem" }}>
                              Fecha de inicio:{" "}
                              {new Date(fixedTerm.startDate).toLocaleString("es-ES", { dateStyle: "medium" })}
                            </Typography>
                            <Typography style={{ fontSize: "0.90rem" }}>
                              Fecha de fin:{" "}
                              {new Date(fixedTerm.endDate).toLocaleString("es-ES", { dateStyle: "medium" })}
                            </Typography>
                          </Grid>
                          <Grid item size={4} style={{ textAlign: "right" }}>
                            <Typography style={{ fontWeight: "bold", color: "#000", fontSize: "1rem" }}>
                              Monto: ${fixedTerm.amount}
                            </Typography>
                            <Typography style={{ color: "gray", fontSize: "0.85rem" }}>
                              Tasa de interés: {fixedTerm.interestRate}%
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid container justifyContent="center" style={{ marginTop: 16 }}>
                    <Button style={buttons}>Ver más</Button>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={3}>
          <Card sx={cardStyle}>
            <CardHeader
              sx={{ display: "flex", textAlign: "center" }}
              title={
                <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}>
                  Últimos movimientos
                </Typography>
              }
            />
            <CardContent>
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
                          {transaction.type === "DEPOSITO" && (
                            <ArrowCircleUpRoundedIcon sx={{ fontSize: "36px", color: "#43A047" }} />
                          )}
                          {transaction.type === "INGRESO" && (
                            <ArrowUpwardIcon sx={{ fontSize: "36px", color: "#D32F2F" }} />
                          )}
                          {transaction.type === "PAGO" && (
                            <ArrowCircleDownRoundedIcon sx={{ fontSize: "36px", color: "#FF0000" }} />
                          )}
                        </Grid>
                        <Grid item size={10}>
                          <Grid container>
                            <Grid item size={6}>
                              <Typography sx={{ fontWeight: "bold", color: "#000000", fontSize: "1rem" }}>
                                {transaction.account.firstName} {transaction.account.lastName}
                              </Typography>
                            </Grid>
                            <Grid item size={6} sx={{ textAlign: "right" }}>
                              <Typography sx={{ fontWeight: "bold", color: "#000000", fontSize: "1rem" }}>
                                {transaction.type === "PAGO" ? `- $${transaction.amount}` : `+ $${transaction.amount}`} {transaction.account.currency}
                              </Typography>
                            </Grid>
                            <Grid item size={6}>
                              <Typography>{transaction.concept}</Typography>
                            </Grid>
                            <Grid item size={6} sx={{ textAlign: "right" }}>
                              <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                                {new Date(transaction.timestamp).toLocaleString("es-ES", {
                                  timeStyle: "short",
                                })}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
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
