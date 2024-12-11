import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from "react";
import { Card, Typography, CardHeader, CardContent } from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import api from "../../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

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
                sx={{
                  fontSize: "1.35rem",
                  color: "#2b6a2f",
                  fontWeight: "bold",
                }}
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
                borderTop: "1px solid #43A047",
                p: "10px 12px",
              }}
            >
              <Grid item size={3}>
                <PersonAddAltRoundedIcon sx={{ fontSize: "30px" }} />
              </Grid>
              <Grid item size={6}>
                <Typography sx={{ fontSize: "1rem" }}>Nueva cuenta</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#3A3A3A" }}>
                  Con CBU o alias.
                </Typography>
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
          <CardContent>
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <Grid container key={date} sx={{ marginBottom: "16px" }}>
                {transactions.map((transaction, index) => (
                  <Grid
                    item
                    size={12}
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        borderRight: "4px solid #9cd99e",
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
                        justifyContent: "space-between",
                        borderBottom: "1px solid #E0E0E0",
                      }}
                    >
                      <Grid item size={2}>
                        {transaction.type === "DEPOSITO" || transaction.type === "INGRESO" ? (
                          <ArrowCircleUpRoundedIcon
                            sx={{ fontSize: "36px", color: "#43A047" }}
                          />
                        ) : (
                          <ArrowCircleDownRoundedIcon
                            sx={{ fontSize: "36px", color: "#FF6666" }}
                          />
                        )}
                      </Grid>
                      <Grid item size={8}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#000000",
                            fontSize: "1rem",
                          }}
                        >
                          {transaction.type === "PAGO" ||
                          transaction.type === "DEPOSITO"
                            ? `${transaction.accountDestino?.firstName || ""} ${
                                transaction.accountDestino?.lastName || ""
                              }`
                            : `${transaction.accountOrigen?.firstName || ""} ${
                                transaction.accountOrigen?.lastName || ""
                              }`}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.85rem", color: "#3A3A3A" }}
                        >
                          {transaction.concept}
                        </Typography>
                      </Grid>
                      <Grid item size={2} sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color:
                              transaction.type === "PAGO"
                                ? "#FF6666"
                                : "#43A047",
                            fontSize: "1rem",
                          }}
                        >
                          {transaction.type === "PAGO"
                            ? `- $${transaction.amount}`
                            : `+ $${transaction.amount}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
