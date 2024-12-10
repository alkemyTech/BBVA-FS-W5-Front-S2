import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccountBalance } from '../../services/BalanceSlice';
import { CircularProgress, Card, CardContent, Typography, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";


const formatCurrency = (amount, currency) => {
  if (amount == null || currency == null) {
    return "$ 0.00";
  }
  const validCurrency = currency || 'USD';
  try {
    return `${validCurrency} $ ${new Intl.NumberFormat('en-US').format(amount)}`;
  } catch (error) {
    console.error("Error formateando la moneda:", error);
    return "$0.00";
  }
};

const Balance = () => {
  const dispatch = useDispatch();
  const { balance, loading, error } = useSelector((state) => state.balance);

  useEffect(() => {
    dispatch(fetchAccountBalance());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const cardStyle = {
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
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

  return (
    <Grid container style={gridContainerStyle}>
      {/* Card para Resumen de Balance */}
      <Grid item xs={12} sm={5} md={5}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }} gutterBottom>
              Balance de Cuentas
            </Typography>

            <Typography sx={{ fontSize: "1.25rem", color: "#3A3A3A" }}>
              ARS $ {new Intl.NumberFormat('en-US').format(balance?.accountArs?.balance)}
            </Typography>

            <Typography sx={{ fontSize: "1.25rem", color: "#3A3A3A" }}>
              USD $ {new Intl.NumberFormat('en-US').format(balance?.accountUsd?.balance)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card para Historial de Transacciones */}
      <Grid item xs={12} sm={5} md={5}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }} gutterBottom>
              Historial de Transacciones
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              {balance?.history?.map((transaction, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                    {transaction.description} - {formatCurrency(transaction.amount, transaction.currency)}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    CBU Origen: {transaction.cbuOrigen}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    CBU Destino: {transaction.cbuDestino}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Card para Plazos Fijos */}
      <Grid item xs={12} sm={5} md={5}>
        <Card sx={cardStyle}>
          <CardContent>
            <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }} gutterBottom>
              Plazos Fijos
            </Typography>
            {balance?.fixedTerms?.length > 0 ? (
              balance.fixedTerms.map((term, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                    Monto: {term.amount} {term.currency}
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "#6C6C6C" }}>
                    Fecha de inicio: {new Date(term.startDate).toLocaleDateString()}
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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Balance;
