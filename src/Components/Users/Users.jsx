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
  IconButton
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import Notification from "../../Components/Notification/Notification";
import Paginado from "../../Components/Paginate/Paginado";
import { Card, CardContent, CardActions,   InputAdornment,} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility'; // Ojo
import DeleteIcon from '@mui/icons-material/Delete'; // Basura

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

  const formatCurrency = (amount, currency) => {
    if (amount == null || currency == null) {
      return "$ 0.00";
    }
    const validCurrency = currency || "USD";
    try {
      return `${new Intl.NumberFormat("en-US").format(amount)}`;
    } catch (error) {
      console.error("Error formateando la moneda:", error);
      return "$0.00";
    }
  };

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
          setNotification({
            openSnackbar: true,
            snackbarMessage: "Usuario eliminado correctamente.",
            snackbarSeverity: "success",
          });
  
          // Recargar usuarios después de eliminar
          api
            .get("/users") 
            .then((response) => {
              const updatedUsers = response.data; 
              const newTotalPages = Math.ceil(updatedUsers.length / itemsPerPage);
  
              // Recalcular página actual
              if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages || 1);
              }
  
              // Actualizar estado
              setTotalPages(newTotalPages);
              setUsers(
                updatedUsers.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
              );
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
    background: "#9cd99e",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#2B6A2F",
      color: "#FFFFFF",
    },
  };

  const cardStyle = {
    margin: "8px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };

  const eyeButtonStyles = {
    background: "#9CD99E", 
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#7DC87F", 
      color: "#FFFFFF",
    },
  };
  

  const deleteButtonStyles = {
    background: "#FF6666",
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
      <Card sx={cardStyle}>
        <CardContent>
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            fullWidth
            value={searchName}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                endAdornment:(
                  <InputAdornment position="end">
                    <SearchIcon sx={{color:"#43A047"}}/>
                  </InputAdornment>
                )
              }
            }}
            sx={{
              width: "100%",
              borderRadius:"25px",
              "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                    },
            }}
          />
        </CardContent>
      </Card>

      {/* Tabla de Usuarios */}
      <Card sx={cardStyle}>
        <CardContent>
          {/* Tabla de Usuarios */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "#2B6A2F" }}>Nombre</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "#2B6A2F" }}>Apellido</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "#2B6A2F" }}>Email</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "#2B6A2F" }}>Rol</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "#2B6A2F" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>{user.firstName}</TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>{user.lastName}</TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>{user.email}</TableCell>
                      <TableCell sx={{ textAlign: "center", fontWeight: "bold", fontSize: "0.90rem" }}>{user.role?.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: "10px" }}>
                          <IconButton onClick={() => handleShowAccounts(user.id)}
                            sx={eyeButtonStyles}>
                          <VisibilityIcon />
                          </IconButton>
                          <IconButton onClick={() => openDeleteDialog(user.id)}
                            sx={ deleteButtonStyles }>
                          <DeleteIcon />
                          </IconButton>
                        </Box>
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
            <Paginado
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
        </CardContent>
      </Card>

      

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
                        <strong>Límite:</strong> {formatCurrency(account.transactionLimit, account.currency)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Saldo:</strong> {formatCurrency(account.balance, account.currency)}
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
      />
    </Box>
  );
};

export default Users;
