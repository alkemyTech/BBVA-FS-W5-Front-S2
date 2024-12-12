import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Notification from "../../components/Notification/Notification";
import Paginado from "../../Components/Paginate/Paginado";
import { Card, CardContent, CardActions } from "@mui/material";


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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token no encontrado");
    window.location.href = "/";
    return null;
  }

  // Cargar los usuarios desde la API con filtro por nombre
  useEffect(() => {
    setNotification((prev) => ({ ...prev, loading: true }));
    const url = searchName ? `/users/search?name=${searchName}` : "/users";
    api
      .get(url)
      .then((response) => {
        const totalUsers = response.data.length;
        setUsers(response.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        setTotalPages(Math.ceil(totalUsers / itemsPerPage));
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
  }, [currentPage, searchName]);

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

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
          // Actualizamos la lista de usuarios después de eliminar uno
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== selectedUser.id)
          );
          setNotification({
            openSnackbar: true,
            snackbarMessage: "Usuario eliminado correctamente.",
            snackbarSeverity: "success",
          });
          // Actualizar la paginación y la cantidad total de usuarios
          const remainingUsers = users.filter((user) => user.id !== selectedUser.id);
          setTotalPages(Math.ceil(remainingUsers.length / itemsPerPage));
          if (currentPage > Math.ceil(remainingUsers.length / itemsPerPage)) {
            setCurrentPage(Math.ceil(remainingUsers.length / itemsPerPage));
          }
          // Recargar la lista de usuarios después de la eliminación
          const url = searchName ? `/users/search?name=${searchName}` : "/users";
          api
            .get(url)
            .then((response) => {
              setUsers(response.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            })
            .catch((error) => {
              console.error("Error al recargar los usuarios:", error);
              setNotification({
                openSnackbar: true,
                snackbarMessage: "Error al recargar los usuarios.",
                snackbarSeverity: "error",
              });
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

      {/* Card para el campo de búsqueda */}
      <Card sx={{ boxShadow: "0 2px 10px rgba(0,0,0,0.1)", borderRadius: "10px", mb: 3 }}>
        <CardContent>
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            fullWidth
            value={searchName}
            onChange={handleSearchChange}
            sx={{
              width: "100%",
              marginBottom: "16px",
            }}
          />
        </CardContent>
      </Card>

      {/* Tabla de Usuarios */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#2B6A2F" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2B6A2F" }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2B6A2F" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2B6A2F" }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#2B6A2F" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role?.name}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleShowAccounts(user.id)}
                      sx={buttonStyles}
                    >
                      Ver Cuentas
                    </Button>
                    <Button
                      onClick={() => openDeleteDialog(user.id)}
                      sx={deleteButtonStyles}
                    >
                      Eliminar Usuario
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No hay usuarios disponibles.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Paginado
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Dialog para ver cuentas */}
      {selectedUser && (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
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

      {/* Dialog para confirmar eliminación */}
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
