import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccountBalance } from "../../services/BalanceSlice";
import { CircularProgress, Card, CardContent, Typography, CardActions } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Box,
  TableRow,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Paginado from "../Paginate/Paginado";
import api from "../../services/api";

const formatCurrency = (amount, currency) => {
  if (amount == null || currency == null) {
    return "$ 0.00";
  }
  const validCurrency = currency || "USD";
  try {
    return `${validCurrency} $ ${new Intl.NumberFormat("en-US").format(
      amount
    )}`;
  } catch (error) {
    console.error("Error formateando la moneda:", error);
    return "$0.00";
  }
};



const Balance = () => {
  const dispatch = useDispatch();
  const { balance, loading, error } = useSelector((state) => state.balance);
  const [accounts, setAccounts] = useState([]);

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token no encontrado");
    window.location.href = "/";
    return;
  }

  const [currentPageHistory, setCurrentPageHistory] = useState(1); // Página actual para historial de transacciones
  const [currentPageFixedTerms, setCurrentPageFixedTerms] = useState(1); // Página actual para plazos fijos
  const itemsPerPageHistory = 3; // Mostrar 3 transacciones por página
  const itemsPerPageFixedTerms = 2; // Mostrar 2 plazos fijos por página

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
    dispatch(fetchAccountBalance());
  }, [dispatch, token]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const cardStyle = {
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9CD99E",
  };

  const totalPagesHistory = Math.ceil(
    (balance?.history?.length || 0) / itemsPerPageHistory
  );
  const startIndexHistory = (currentPageHistory - 1) * itemsPerPageHistory;
  const currentHistory =
    balance?.history?.slice(
      startIndexHistory,
      startIndexHistory + itemsPerPageHistory
    ) || [];

  const totalPagesFixedTerms = Math.ceil(
    (balance?.fixedTerms?.length || 0) / itemsPerPageFixedTerms
  );
  const startIndexFixedTerms =
    (currentPageFixedTerms - 1) * itemsPerPageFixedTerms;
  const currentFixedTerms =
    balance?.fixedTerms?.slice(
      startIndexFixedTerms,
      startIndexFixedTerms + itemsPerPageFixedTerms
    ) || [];

  return (
    <Grid container>
      {/* Card para Resumen de Balance */}
      <Grid item size={12}>
        <Card sx={cardStyle}>
          <CardContent>
            <Grid
              container
              direction="column"
              alignItems="center"
              textAlign="center"
            >
              {/* Título */}
              <Grid item size={12}>
                <Typography
                  sx={{
                    fontSize: "1.35rem",
                    color: "#2B6A2F",
                    fontWeight: "bold",
                  }}
                  gutterBottom
                >
                  Balance de Cuentas
                </Typography>
              </Grid>
              {/* Datos de las cuentas */}
              <Grid item container spacing={10}>
                {accounts.map((account, index) => (
                  <Grid
                    item
                    key={index}
                    xs={12}
                    sm={6}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start", // Alineación al inicio
                      textAlign: "left", // Alinear texto a la izquierda
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.25rem",
                        color: "#3A3A3A",
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(account.balance, account.currency)}
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                      CBU: {account.cbu}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Card para Historial de Transacciones */}
      <Grid item size={8}>
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
              Historial de Transacciones
            </Typography>
            {balance?.history?.length > 0 ? (
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Detalle</TableCell>
                        <TableCell>CBU Origen</TableCell>
                        <TableCell>CBU Destino</TableCell>
                        <TableCell>Monto</TableCell>
                      </TableRow>

                    </TableHead>
                    <TableBody>
                      {currentHistory.map((transaction, index) => (
                        <TableRow key={index} sx={{
                          borderLeft:
                                  transaction.type === "Pago"
                                    ? "4px solid #FF6666"
                                    : "4px solid #9cd99e",
                        }}>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.cbuOrigen}</TableCell>
                          <TableCell>{transaction.cbuDestino}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount, transaction.currency)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <CardActions>
                  <Paginado
                      totalPages={totalPagesHistory}
                      currentPage={currentPageHistory}
                      onPageChange={setCurrentPageHistory}
                        />
                </CardActions>

              {/* Componente de paginación para historial de transacciones */}
                
            </Box>
            ) : (
              <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                No tienes transacciones registradas.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Card para Plazos Fijos */}
      <Grid item size={4}>
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
              Plazos Fijos
            </Typography>
            {currentFixedTerms.length > 0 ? (
              currentFixedTerms.map((term, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                  Monto: {term.currency} ${new Intl.NumberFormat("en-US").format(
                      term.amount
                    )}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    Fecha de inicio:{" "}
                    {new Date(term.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    Fecha de fin: {new Date(term.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    Liquidación: ${term.interestRate}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                No tienes plazos fijos registrados.
              </Typography>
            )}
            {/* Componente de paginación para plazos fijos */}
              <Paginado
                totalPages={totalPagesFixedTerms}
                currentPage={currentPageFixedTerms}
                onPageChange={setCurrentPageFixedTerms}
              />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Balance;
