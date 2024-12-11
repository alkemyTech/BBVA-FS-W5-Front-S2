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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Notification from "../../components/Notification/Notification";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({
    openSnackbar: false,
    snackbarMessage: "",
    snackbarSeverity: "success",
    loading: false,
  });

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token no encontrado");
    window.location.href = "/";
    return null;
  }

  // Cargar los usuarios desde la API
  useEffect(() => {
    setNotification((prev) => ({ ...prev, loading: true }));
    api
      .get("/users")
      .then((response) => {
        console.log("Usuarios recibidos:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
        setNotification({
          openSnackbar: true,
          snackbarMessage: "Error al cargar usuarios.",
          snackbarSeverity: "error",
        });
      })
      .finally(() => {
        setNotification((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  const handleShowAccounts = (userId) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setNotification((prev) => ({ ...prev, loading: true }));
      api
        .delete(`/users/${selectedUser.id}`)
        .then(() => {
          setUsers(users.filter((user) => user.id !== selectedUser.id));
          setNotification({
            openSnackbar: true,
            snackbarMessage: "Usuario eliminado correctamente.",
            snackbarSeverity: "success",
          });
        })
        .catch((error) => {
          console.error("Error al eliminar usuario:", error);
          setNotification({
            openSnackbar: true,
            snackbarMessage: "No se pudo eliminar el usuario. Inténtalo de nuevo.",
            snackbarSeverity: "error",
          });
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setNotification((prev) => ({ ...prev, loading: false }));
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

      {selectedUser && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" >
          <DialogTitle sx={{ color: "#2B6A2F", fontWeight: "bold" }}>
            Cuentas de {selectedUser.firstName} {selectedUser.lastName}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {selectedUser.accounts?.map((account) => (
                <Grid item xs={12} sm={6} key={account.id}>
                  <Card
                    sx={{
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      width: "100%",
                      padding: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        <strong>CBU:</strong> {account.cbu}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Moneda:</strong> {account.currency}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Límite:</strong> {account.transactionLimit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Saldo:</strong> {account.balance}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
  <Button onClick={handleClose} sx={buttonStyles}>
    Cerrar
  </Button>
</DialogActions>

        </Dialog>
      )}

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

      <Notification
        openSnackbar={notification.openSnackbar}
        snackbarMessage={notification.snackbarMessage}
        snackbarSeverity={notification.snackbarSeverity}
        setOpenSnackbar={(value) =>
          setNotification((prev) => ({ ...prev, openSnackbar: value }))
        }
        loading={notification.loading}
      />
    </Box>
  );
};

export default Users;
