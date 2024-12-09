import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccountBalance } from '../../services/AccountSlice';
import { fetchTransactions } from '../../services/TransactionSlice'; 
import { CircularProgress, Card, CardContent, Typography, Box } from '@mui/material';
import Grid from "@mui/material/Grid2";

const formatCurrency = (amount, currency) => {
  if (amount == null || currency == null) {
    return "$ 00";  
  }
  const validCurrency = currency || 'USD'; 
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: validCurrency }).format(amount);
  } catch (error) {
    console.error("Error formateando la moneda:", error);
    return "$0";  
  }
};

const Balance = () => {
  const dispatch = useDispatch();
  const { balance, loading: balanceLoading, error: balanceError } = useSelector((state) => state.account);
  const { transactions, loading: transactionsLoading, error: transactionsError } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchAccountBalance());
    dispatch(fetchTransactions()); 
  }, [dispatch]);

  if (balanceError) return <Typography color="error">{balanceError}</Typography>;
  if (transactionsError) return <Typography color="error">{transactionsError}</Typography>;

  const cardStyle = {
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
    width: "100%",
    maxWidth: "800px",
    display: "flex",  // Flexbox para hacer que las tarjetas tengan el mismo alto
    flexDirection: "column",  // Asegura que el contenido se organice verticalmente dentro de la tarjeta
  };

  const gridContainerStyle = {
    display: "flex",  // Habilita el comportamiento Flexbox
    justifyContent: "center",  // Centra las tarjetas horizontalmente
    gap: "20px",  // Espaciado entre las tarjetas
  };

  return (
    <Grid container style={gridContainerStyle}>
      {/* Card para Resumen de Balance */}
      <Grid item xs={12} sm={5} md={5}> {/* Asegura que cada tarjeta ocupe 50% del ancho en pantallas medianas */}
        <Card sx={cardStyle}>
          <CardContent>
            <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }} gutterBottom>
              Resumen de Balance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1.25rem", color: "#3A3A3A" }}>
                  {formatCurrency(balance?.accountArs?.balance, 'ARS')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1.25rem", color: "#3A3A3A" }}>
                  USD {formatCurrency(balance?.accountUsd?.balance, 'USD')}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 2 }}>
              {balance?.history?.map((transaction, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                    {transaction.description} - {formatCurrency(transaction.amount, 'ARS')}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Card para Historial de Transacciones */}
      <Grid item xs={12} sm={5} md={5}> {/* Asegura que cada tarjeta ocupe 50% del ancho en pantallas medianas */}
        <Card sx={cardStyle}>
          <CardContent>
            <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold", marginTop: 3 }} gutterBottom>
              Última Transaccion
            </Typography>
            <Box sx={{ marginTop: 1}}>
              {transactions?.map((transaction, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography sx={{ fontSize: "1rem", color: "#3A3A3A" }}>
                    {transaction.description} - {formatCurrency(transaction.amount, 'ARS')}
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
    </Grid>
  );
};

export default Balance;
