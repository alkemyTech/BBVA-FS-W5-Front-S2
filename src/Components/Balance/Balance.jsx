import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccountBalance } from "../../services/BalanceSlice";
import {CircularProgress, Card, CardContent, Typography, Box } from "@mui/material";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Mostrar 1 plazo fijo por página

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
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
  };

  const gridContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  };

  const totalPages = Math.ceil(
    (balance?.fixedTerms?.length || 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFixedTerms =
    balance?.fixedTerms?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <Grid container style={gridContainerStyle}>
      {/* Card para Resumen de Balance */}
      <Grid item xs={12} sm={5} md={5}>
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
              Balance de Cuentas
            </Typography>
            {accounts.map((account, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
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
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Card para Historial de Transacciones */}
      <Grid item xs={12} sm={5} md={5}>
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
    <Box sx={{ marginTop: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Detalle</TableCell>
              <TableCell>CBU Origen</TableCell>
              <TableCell>CBU Destino</TableCell>
              <TableCell>Moneda</TableCell>
              <TableCell>Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balance.history.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.cbuOrigen}</TableCell>
                <TableCell>{transaction.cbuDestino}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell>{(transaction.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
      <Grid item xs={12} sm={5} md={5}>
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
                    Monto: {term.amount} {term.currency}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    Fecha de inicio:{" "}
                    {new Date(term.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    Fecha de fin: {new Date(term.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    Tasa de interés: {term.interestRate}%
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                No tienes plazos fijos registrados.
              </Typography>
            )}
            {/* Componente de paginación */}
            {currentFixedTerms.length > 0 && (
              <Paginado
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Balance;
