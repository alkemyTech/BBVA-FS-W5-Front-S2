import React, { useState, useEffect } from 'react';
import api from "../../services/Api";
import { Typography, Button, Box, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from "@mui/material/Grid2";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  // Cargar los usuarios desde la API
  useEffect(() => {
    api.get('/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  const handleShowAccounts = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setOpen(true); // Abre el diálogo
  };

  const handleDeleteUser = (userId) => {
    // Lógica para eliminar usuario
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      api.delete(`/users/${userId}`)
        .then(() => {
          setUsers(users.filter(user => user.id !== userId));
          alert("Usuario eliminado correctamente.");
        })
        .catch(error => {
          console.error("Error al eliminar usuario:", error);
          alert("No se pudo eliminar el usuario. Inténtalo de nuevo.");
        });
    }
  };

  const handleClose = () => {
    setOpen(false); // Cierra el diálogo
  };

  const buttonStyles = {
    background: "#2B6A2F", // color verde
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF", // texto blanco
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#9CD99E", // color verde claro
      color: "#FFFFFF",
    },
  };

  const deleteButtonStyles = {
    background: "#C62828", // color rojo
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF", // texto blanco
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#FF5252", // rojo claro
      color: "#FFFFFF",
    },
  };

  return (
    <Box p={3} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Título centralizado */}
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#2B6A2F", fontWeight: 'bold' }}>
        Usuarios
      </Typography>

      {/* Mostrar los usuarios en Cards */}
      <Grid container spacing={3} justifyContent="center">
        {users.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card sx={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '10px', width: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#2B6A2F", fontWeight: 'bold' }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Rol:</strong> {user.role.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  onClick={() => handleShowAccounts(user.id)}
                  fullWidth
                  sx={buttonStyles}
                >
                  Ver Cuentas
                </Button>
                <Button
                  onClick={() => handleDeleteUser(user.id)}
                  fullWidth
                  sx={deleteButtonStyles}
                >
                  Eliminar Usuario
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para mostrar cuentas */}
      {selectedUser && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: "#2B6A2F", fontWeight: 'bold' }}>
            Cuentas de {selectedUser.firstName} {selectedUser.lastName}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ color: "#2B6A2F", fontWeight: 'bold' }}>CBU</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ color: "#2B6A2F", fontWeight: 'bold' }}>Moneda</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ color: "#2B6A2F", fontWeight: 'bold' }}>Límite</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ color: "#2B6A2F", fontWeight: 'bold' }}>Saldo</Typography>
              </Grid>
            </Grid>

            {selectedUser.accounts.map(account => (
              <Grid container spacing={3} key={account.id} justifyContent="center" sx={{ mt: 1 }}>
                <Grid item xs={3}>
                  <Typography align="center">{account.cbu}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center">{account.currency}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center">{account.transactionLimit}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center">{account.balance}</Typography>
                </Grid>
              </Grid>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={buttonStyles}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Users;
