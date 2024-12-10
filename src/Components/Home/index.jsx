import Grid from '@mui/material/Grid2';
import { Typography, Card, CardContent, Box, TableHead } from "@mui/material";
import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Prestamos from "../../assets/img/Prestamos.jpg";
import PlazosFijos from "../../assets/img/Plazos Fijos.jpg";
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import  ArrowDownwardIcon  from "@mui/icons-material/ArrowDownWard";
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';


export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  


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
  }, []);

  const cardStyle = {
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };

  const cardTransactionStyle = {
    borderRadius: "5px",
    margin:"10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderBottom: "4px solid #9cd99e",


  };

  const buttons = {
    backgroundColor: "#9cd99e",
    borderRadius: "25px",
    padding:"6px 16px",
    color: "#2b6a2f",
    fontWeight:"bold",
  };

  return (
    <Grid container spacing={2} sx={{marginTop: 1, p:1,  }}>
      <Grid item size={8}>
        <Grid container>
          {accounts.map((account) => (
            <Grid item size={6} key={account.id}>
              <Card sx={cardStyle}>
              <CardHeader
                action={
                    <IconButton arial-label="settings">
                      <BadgeOutlinedIcon sx={{ color: "#2b6a2f", fontSize: "1.5rem" }} />
                    </IconButton>
                } 
                title={
                  <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}>
                    {`Cuenta en ${account.currency}`}
                  </Typography>
                }
              />
              <CardContent>
                <Typography sx={{ fontSize: "1.25rem", color: "#3A3A3A", marginBottom: "8px" }}>
                  Dinero disponible
                </Typography>
                <Typography sx={{ fontSize: "2rem", color: "#000000", fontWeight: "bold" }}>
                  ${account.balance}
                </Typography>
              </CardContent>
                <Grid container size={12} sx={{ gap:2, textAlign: "center", marginTop: 2,padding: "10px", justifyContent: "center" }}>
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
          <Grid item>
            <Grid container>
              <Grid item size={6}>
                <Card sx={cardStyle}>
                  <CardMedia
                    component="img"
                    alt="Plazos fijos"
                    height="140"
                    image={PlazosFijos}  
                    width="100%"
                    sx={{ objectFit: 'cover' }}  
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Plazos fijos
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ¡Hacé crecer tu dinero hoy!
                      Descubrí la seguridad y rentabilidad de nuestro plazo fijo.
                      Invertí fácil y seguro, ¡tu futuro te lo agradecerá!
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={4}>
        <Card sx={cardStyle}>
          <CardHeader
            sx={{
              display: "flex",
              textAlign: "center",
            }}
            title={
              <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}>
                Últimos movimientos
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={1}>
              {transactions.slice(0, 6).map((transaction, index) => (
                <Grid item size={12} key={index}>
                  <Grid item size={12}>
                    <Grid
                      container
                      spacing={1}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 12px",
                        justifyContent: "space-between",
                      }}
                    >
                      <Grid item size={2}>
                        <ArrowCircleUpRoundedIcon sx={{ fontSize: "36px", color: "#43A047" }} />
                      </Grid>
                      <Grid item size={10}>
                        <Grid container>
                          <Grid item size={9}>
                            <Typography sx={{ fontWeight: "bold", color: "#000000", fontSize: "1rem" }}>
                              {transaction.account.firstName} {transaction.account.lastName}
                            </Typography>
                          </Grid>
                          <Grid item size={3} sx={{textAlign: "right",}}>
                            <Typography sx={{ fontWeight: "bold", color: "#000000", fontSize: "1rem" }}>
                              ${transaction.amount}
                            </Typography>
                          </Grid>
                          <Grid item size={9}>
                            <Typography>{transaction.description}</Typography>
                          </Grid>
                          <Grid item size={3} sx={{textAlign: "right",}}>
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
  ); 
}