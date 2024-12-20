import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  TablePagination,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import api from "../../../services/api.jsx";
import Paginado from "../../Paginate/Paginado";
import TransactionSendForm from "../TransactionSendForm/index.jsx";
import Notification from "../../Notification/Notification";

export default function Transactions() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedCBU, setSelectedCBU] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const token = localStorage.getItem("token");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [form, setForm] = useState({
    destinationCbu: "",
    amount: "",
    currency: "",
    description: "",
    concept: ""
});
  const paginatedTransactions = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const navigate = useNavigate();

  const openConfirmDialog = (cbu) => {
    setSelectedCBU(cbu);
    setConfirmDialogOpen(true);
  };

  const isBeneficiary = (cbu) => {
    return beneficiarios.some((beneficiario) =>
      beneficiario.accountsDTO.some((account) => account.cbu === cbu)
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchBeneficiarios = async () => {
    try {
      const response = await api.get("/users/beneficiarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBeneficiarios(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        navigate("/");
        return;
      }
      const response = await api.get("/transactions/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      if (error.response?.status === 401) {
        window.location.href = "/";
      }
    }
  };

  const sendForm = async () => {
    const { destinationCbu, amount, currency, description, concept } = form;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }
    setLoading(true);
    setOpen(false);

    try {
        const response = await api.post(
            "/transactions/send",
            {
                destinationCbu,
                amount: formatAmountForServer(amount),
                currency,
                description,
                concept
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        setForm({
            destinationCbu: "",
            amount: "",
            currency: "",
            description: "",
            concept: ""
        });
        setLoading(false);
        setSnackbarMessage("Transaccion finalizada");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
            navigate("/home");
        }, 500);
    } catch (error) {
        console.error("Error al enviar la transacción:", error);
        const errorMessage = error.response ? error.response.data.message : "Error desconocido";
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.destinationCbu) errors.destinationCbu = "CBU es obligatorio";
    if (!form.amount) {
        errors.amount = "Monto es obligatorio";
    }
    if (!form.currency) errors.currency = "Moneda es obligatoria";
    if (!form.description) errors.description = "Descripción es obligatoria";
    if (!form.concept) errors.concept = "Concepto es obligatorio";
    return errors;
};

  const formatAmountForServer = (amount) => {
    return parseFloat(amount.replace(/\./g, "").replace(",", ".")); 
  };


  const addBeneficiary = async () => {
    try {
      if (!token) {
        navigate("/");
      }
      const response = await api.post(
        "/users/beneficiarios/add",
        { cbu: selectedCBU },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setSnackbarMessage("Beneficiario agregado con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setConfirmDialogOpen(false);
      fetchBeneficiarios();
    } catch (error) {
      console.error("Error al enviar la transacción:", error);
      const errorMessage = error.response
        ? error.response.data.message
        : "Error desconocido";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBeneficiarios();
  }, []);

  const cardStyle = {
    margin: "8px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };

  const buttons = {
    backgroundColor: "#9cd99e",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#2b6a2f",
    fontWeight: "bold",
  };

  const buttonsError = {
    backgroundColor: "#FF6666",
    borderRadius: "25px",
    padding: "6px 16px",
    color: "#f4f4f4",
    fontWeight: "bold",
  };

  return (
    <Grid container sx={{ display: "flex", flexDirection: "column" }}>
      <Grid item size={12}>
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
                Elegí a qué cuenta transferir
              </Typography>
            }
          />
          <CardContent>
            <Grid
              container
              sx={{
                alignItems: "center",
                textAlign: "center",
                p: "10px 12px",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderRight: "4px solid #9cd99e",
                  cursor: "pointer",
                },
              }}
              onClick={handleOpen}
            >
              <Grid item size={3}>
                <PersonAddAltRoundedIcon
                  sx={{ fontSize: "40px", color: "#43A047" }}
                />
              </Grid>
              <Grid item size={7}>
                <Typography sx={{ fontSize: "1rem" }}>Nueva cuenta</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#3A3A3A" }}>
                  Con CBU.
                </Typography>
              </Grid>
              <Grid item size={2}>
                <KeyboardArrowRightIcon
                  sx={{ fontSize: "40px", color: "#43A047" }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
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
                Últimos movimientos
              </Typography>
            }
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      Tipo
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      Nombre
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      Concepto
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      CBU Origen
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      CBU Destino
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      Moneda
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      Monto
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      Fecha
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.90rem",
                      }}
                    >
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTransactions.map((transaction, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        borderLeft:
                              transaction.type === "Pago"
                                ? "4px solid #FF6666"
                                : "4px solid #9cd99e",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          cursor: "pointer",
                          
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                          gap: 1,
                        }}
                      >
                        {transaction.type === "Deposito" ||
                        transaction.type === "Ingreso" ? (
                          <ArrowCircleUpRoundedIcon
                            sx={{ height: "40px", color: "#43A047" }}
                          />
                        ) : (
                          <ArrowCircleDownRoundedIcon
                            sx={{ height: "40px", color: "#FF6666" }}
                          />
                        )}
                        {transaction.type}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {transaction.type === "Pago" ||
                        transaction.type === "Deposito"
                          ? `${transaction.accountDestino?.firstName || transaction.accountOrigen?.firstName} ${
                              transaction.accountDestino?.lastName || transaction.accountOrigen?.lastName
                            }`
                          : `${transaction.accountOrigen?.firstName || transaction.accountDestino?.firstName} ${
                              transaction.accountOrigen?.lastName || transaction.accountDestino?.lastName
                            }`}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {transaction.concept}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {transaction.cbuOrigen || "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {transaction.cbuDestino || "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {transaction.accountDestino?.currency ||
                          transaction.accountOrigen?.currency}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color:
                            transaction.type === "Pago" ? "#FF6666" : "#43A047",
                        }}
                      >
                        {transaction.type === "Pago"
                          ? `- $${transaction.amount}`
                          : `+ $${transaction.amount}`}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {new Date(transaction.timestamp).toLocaleString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            openConfirmDialog(transaction.cbuDestino)
                          }
                        >
                          {isBeneficiary(transaction.cbuDestino) ? (
                            <StarIcon sx={{ color: "#43A047" }} />
                          ) : (
                            <StarBorderIcon sx={{ color: "#43A047" }} />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Paginado
              totalPages={Math.ceil(transactions.length / itemsPerPage)}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPageOptions={""}
              onItemsPerPageChange={setItemsPerPage}
            />
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={open} sx={cardStyle}>
        <DialogTitle>Enviar Transacción</DialogTitle>
        <DialogContent>
          <TransactionSendForm form={form} setForm={setForm}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={buttonsError}>
            Cancelar
          </Button>
          <Button  onClick={sendForm} sx={buttons} type="submit">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} fullWidth maxWidth="sm">
        <DialogTitle>Agregar beneficiario</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Quieres agregar el CBU {selectedCBU} a tus beneficiarios?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={buttons}>
            Cancelar
          </Button>
          <Button onClick={addBeneficiary} sx={buttons}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        snackbarSeverity={snackbarSeverity}
        setOpenSnackbar={setOpenSnackbar}
        loading={loading}
      />
    </Grid>
  );
}
