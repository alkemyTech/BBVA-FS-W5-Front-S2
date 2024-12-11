import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const Users = () => {
  const [users, setUsers] = useState([]); // Asegúrate de que users sea un arreglo vacío inicialmente
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // 'success' | 'error'

  // Cargar los usuarios desde la API
  useEffect(() => {
    api
      .get("/users")
      .then((response) => {
        console.log("Usuarios recibidos:", response.data); // Verificar la respuesta de la API
        setUsers(response.data); // Actualizar el estado con los usuarios
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
      });
  }, []);

  const handleShowAccounts = (userId) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      api
        .delete(`/users/${selectedUser.id}`)
        .then(() => {
          setUsers(users.filter((user) => user.id !== selectedUser.id));
          setAlertMessage("Se eliminó al usuario correctamente.");
          setAlertSeverity("success");
        })
        .catch((error) => {
          console.error("Error al eliminar usuario:", error);
          setAlertMessage(
            "No se pudo eliminar el usuario. Inténtalo de nuevo."
          );
          setAlertSeverity("error");
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setAlertOpen(true); // Mostrar el Snackbar con el mensaje
        });
    }
  };

  const openDeleteDialog = (userId) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonStyles = {
    background: "#2B6A2F",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#9CD99E",
      color: "#FFFFFF",
    },
  };

  const deleteButtonStyles = {
    background: "#C62828",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#FF5252",
      color: "#FFFFFF",
    },
  };

  return (
    <Box p={3} sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        textAlign="center"
        sx={{ color: "#2B6A2F", fontWeight: "bold" }}
      >
        Usuarios
      </Typography>

      {/* Mostrar los usuarios en Cards */}
      <Grid container spacing={3} justifyContent="center">
        {users.length > 0 ? (
          users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card
                sx={{
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  width: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: "#2B6A2F", fontWeight: "bold" }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Rol:</strong> {user.role?.name}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Button
                    onClick={() => handleShowAccounts(user.id)}
                    fullWidth
                    sx={buttonStyles}
                  >
                    Ver Cuentas
                  </Button>
                  <Button
                    onClick={() => openDeleteDialog(user.id)}
                    fullWidth
                    sx={deleteButtonStyles}
                  >
                    Eliminar Usuario
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No hay usuarios disponibles.
          </Typography>
        )}
      </Grid>

      {/* Diálogo para mostrar cuentas */}
      {selectedUser && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: "#2B6A2F", fontWeight: "bold" }}>
            Cuentas de {selectedUser.firstName} {selectedUser.lastName}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={3}>
                <Typography
                  variant="h6"
                  sx={{ color: "#2B6A2F", fontWeight: "bold" }}
                >
                  CBU
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="h6"
                  sx={{ color: "#2B6A2F", fontWeight: "bold" }}
                >
                  Moneda
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="h6"
                  sx={{ color: "#2B6A2F", fontWeight: "bold" }}
                >
                  Límite
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="h6"
                  sx={{ color: "#2B6A2F", fontWeight: "bold" }}
                >
                  Saldo
                </Typography>
              </Grid>
            </Grid>

            {selectedUser.accounts?.map((account) => (
              <Grid
                container
                spacing={3}
                key={account.id}
                justifyContent="center"
                sx={{ mt: 1 }}
              >
                <Grid item xs={3}>
                  <Typography align="center">{account.cbu}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center">{account.currency}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography align="center">
                    {account.transactionLimit}
                  </Typography>
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

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle sx={{ color: "#C62828", fontWeight: "bold" }}>
          ¿Estás seguro de que deseas eliminar a {selectedUser?.firstName}{" "}
          {selectedUser?.lastName}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteUser} sx={deleteButtonStyles}>
            Sí
          </Button>
          <Button onClick={closeDeleteDialog} sx={buttonStyles}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de alerta */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
