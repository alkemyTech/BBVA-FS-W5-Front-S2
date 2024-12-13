import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Container,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Notification from "../Notification/Notification";
import api from "../../services/api";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState(""); // Para el mensaje de confirmación
  const token = localStorage.getItem("token");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      try {
        const response = await api.get("/users/beneficiarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        
        // Agrupar beneficiarios por nombre y apellido (y usuario)
        const groupedBeneficiarios = data.reduce((acc, beneficiario) => {
          const key = `${beneficiario.nombreApellido}-${beneficiario.username}`;
          
          if (!acc[key]) {
            acc[key] = {
              ...beneficiario,
              accountsDTO: [],
            };
          }

          // Concatenar las cuentas si el beneficiario ya está en el acumulador
          acc[key].accountsDTO = [...acc[key].accountsDTO, ...beneficiario.accountsDTO];
          return acc;
        }, {});

        setBeneficiarios(Object.values(groupedBeneficiarios));
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los beneficiarios:", error);
      }
    };

    fetchBeneficiarios();
  }, [token]);

  const cardStyle = {
    margin: "8px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };


  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#2B6A2F", fontWeight: "bold" }}
        >
          Perfil de usuario
        </Typography>
      </Box>

      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing={8} justifyContent="center" alignItems="center">
          <Grid xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Nombre Completo"
              value={user.nombre + " " + user.apellido || "No disponible"}
              variant="outlined"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  width: "100%", // Ajusta el padding interno del input
                },
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Rol"
              value={user.rol || "No disponible"}
              variant="outlined"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  width: "100%", // Ajusta el padding interno del input
                },
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Email"
              value={user.email || "No disponible"}
              variant="outlined"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  width: "125%", // Ajusta el padding interno del input
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
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
                  Beneficiarios
                </Typography>
              }
            />
            <CardContent>
              {beneficiarios.length === 0 ? (
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "1rem",
                    color: "#9e9e9e",
                  }}
                >
                  No hay beneficiarios agregados
                </Typography>
              ) : (
                <TableContainer>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="Beneficiarios table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.90rem",
                            textAlign: "center",
                          }}
                        >
                          Nombre y Apellido
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.90rem",
                            textAlign: "center",
                          }}
                        >
                          Usuario
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.90rem",
                            textAlign: "center",
                          }}
                        >
                          CBU(s)
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.90rem",
                            textAlign: "center",
                          }}
                        >
                          Moneda(s)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {beneficiarios.map((beneficiario) => (
                        <Tooltip
                          key={beneficiario.idRecipient}
                        >
                          <TableRow
                            sx={{
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                                cursor: "pointer",
                                borderRight: "4px solid #9cd99e",
                              },
                            }}
                          >
                            <TableCell
                              sx={{ fontSize: "0.90rem", textAlign: "center" }}
                            >
                              {beneficiario.nombreApellido}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: "0.90rem", textAlign: "center" }}
                            >
                              {beneficiario.username}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: "0.90rem", textAlign: "center" }}
                            >
                              {beneficiario.accountsDTO.map((account, index) => (
                                <div key={account.id}>
                                  {account.cbu}
                                  {index < beneficiario.accountsDTO.length - 1 && " "}
                                </div>
                              ))}
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: "0.90rem", textAlign: "center" }}
                            >
                              {beneficiario.accountsDTO.map((account, index) => (
                                <div key={account.id}>
                                  {account.currency}
                                  {index < beneficiario.accountsDTO.length - 1 && " "}
                                </div>
                              ))}
                            </TableCell>
                          </TableRow>
                        </Tooltip>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      <Notification
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        setOpenSnackbar={setOpenSnackbar}
        loading={loading}
      />
    </Container>
  );
};

export default UserProfile;
