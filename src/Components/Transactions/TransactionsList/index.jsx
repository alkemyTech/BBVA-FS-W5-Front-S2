import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from "react";
import { Card, Typography, CardHeader, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import api from "../../../services/api"

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const groupByDay = (data) => {
    return data.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString("es-ES");
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    }, {});
  };

  const groupedTransactions = groupByDay(transactions);

  const cardStyle = {
    margin: "8px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };

  return (
    <Grid container sx={{ display: "flex", flexDirection: "column" }}>
      <Grid item size={12}>
        <Card sx={cardStyle}>
          <CardHeader
            title={
              <Typography
                sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}
              >
                Elegí a qué cuenta transferir
              </Typography>
            }
          />
          <CardContent>
            <Grid
              container
              sx={{
                alignItems: "center",
                textAlign: "center",
                p: "10px 12px",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderRight: "4px solid #9cd99e",
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate("/enviarTransaccion")}
            >
              <Grid item size={3}>
                <PersonAddAltRoundedIcon sx={{ fontSize: "40px", color: "#43A047" }} />
              </Grid>
              <Grid item size={7}>
                <Typography sx={{ fontSize: "1rem" }}>Nueva cuenta</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#3A3A3A" }}>
                  Con CBU o alias.
                </Typography>
              </Grid>
              <Grid item size={2}>
                <KeyboardArrowRightIcon
                  sx={{
                    fontSize: "40px",
                    color: "#43A047",
                    "&:hover": { fontSize: "50px" },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card sx={cardStyle}>
          <CardHeader
            title={
              <Typography
                sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}
              >
                Últimos movimientos
              </Typography>
            }
          />
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>Tipo</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>Nombre</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>Concepto</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>CBU Origen</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>CBU Destino</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>Moneda</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>Monto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index} sx={{ "&:hover": {
                    backgroundColor: "#f5f5f5",
                    cursor: "pointer",
                    "&:hover": {
                      borderRight: transaction.type === "Pago" ? "4px solid #FF6666" : "4px solid #9cd99e",
                    },
                  } }}>
                    <TableCell sx={{ textAlign: "center", display:"flex",alignItems:"center",justifyContent:"space-around", gap:1 }}>
                      {transaction.type === "Deposito" || transaction.type === "Ingreso" ? (
                        <ArrowCircleUpRoundedIcon sx={{ fontSize: "20px", color: "#43A047" }} />
                      ) : (
                        <ArrowCircleDownRoundedIcon sx={{ fontSize: "20px", color: "#FF6666" }} />
                      )}
                      <Typography sx={{fontSize:"0.90rem"}}>{transaction.type}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {transaction.type === "Pago" || transaction.type === "Deposito"
                        ? `${transaction.accountDestino?.firstName || ""} ${transaction.accountDestino?.lastName || ""}`
                        : `${transaction.accountOrigen?.firstName || ""} ${transaction.accountOrigen?.lastName || ""}`}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{transaction.concept}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{transaction.cbuOrigen || "N/A"}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{transaction.cbuDestino || "N/A"}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{transaction.accountDestino?.currency}</TableCell>
                    <TableCell align="center" sx={{
                      fontWeight: "bold",
                      color: transaction.type === "Pago" ? "#FF6666" : "#43A047",
                    }}>
                      {transaction.type === "Pago"
                        ? `- $${transaction.amount}`
                        : `+ $${transaction.amount}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}