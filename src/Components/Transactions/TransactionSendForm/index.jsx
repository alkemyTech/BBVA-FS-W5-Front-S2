import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Card, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import api from "../../../services/Api";
import Notification from "../../Notification/Notification";
import { NumericFormat } from "react-number-format";

export default function TransactionSendForm() {
    const [errors, setErrors] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        destinationCbu: "",
        amount: "",
        currency: "",
        description: "",
        concept: ""
    });
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    if (!token) {
        console.error("Token no encontrado");
        navigate("/"); 
        return;
    }

    useEffect(() => {
        setForm({
            destinationCbu: "",
            amount: "",
            currency: "",
            description: "",
            concept: ""
        });
        setErrors("");
    }, [token]);

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

    const sendForm = async (e) => {
        e.preventDefault();
        const { destinationCbu, amount, currency, description, concept } = form;
    
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        setLoading(true);
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

    const concepts = [
        "Servicios",
        "Salud",
        "Transporte",
        "Alquiler",
        "Comida",
        "Otros",
        "Deposito"
    ];

    const currencies = ["ARS", "USD"];

    const buttons = {
        backgroundColor: "#9cd99e",
        borderRadius: "25px",
        padding: "6px 16px",
        color: "#2b6a2f",
        fontWeight: "bold"
    };

    
    return (
        <div>
            <form onSubmit={sendForm}>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item size={12}>
                            <Grid container spacing={2} p={2}>
                                <Grid item size={12}>
                                    <Typography variant="body1" color="text.secondary">
                                        Por favor, completa los siguientes campos para enviar tu transacción.
                                    </Typography>
                                </Grid>
                                <Grid item size={12}>
                                    <TextField
                                        customInput={TextField}
                                        fullWidth
                                        label="CBU Destino"
                                        name="destinationCbu"
                                        value={form.destinationCbu}
                                        placeholder="Ingresa el CBU"
                                        error={!!errors.destinationCbu}
                                        onChange={(e) => setForm({ ...form, destinationCbu: e.target.value })}
                                        helperText={errors.destinationCbu}
                                    />
                                </Grid>
                                <Grid item size={5}>
                                    <NumericFormat
                                        customInput={TextField}
                                        fullWidth
                                        label="Monto"
                                        name="amount"
                                        value={form.amount}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        decimalScale={2}
                                        fixedDecimalScale
                                        allowNegative={false}
                                        placeholder="Ingresa el monto"
                                        error={!!errors.amount}
                                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                        helperText={errors.amount}
                                    />
                                </Grid>
                                <Grid item size={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="currency-label">Moneda</InputLabel>
                                        <Select
                                            labelId="currency-label"
                                            id="currency-select"
                                            value={form.currency}
                                            name="currency"
                                            onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                            label="Moneda"
                                            error={!!errors.currency}
                                        >
                                            {currencies.map((currency) => (
                                                <MenuItem key={currency} value={currency}>
                                                    {currency}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item size={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="concept-label">Concepto</InputLabel>
                                        <Select
                                            labelId="concept-label"
                                            id="concept-select"
                                            value={form.concept}
                                            name="concept"
                                            onChange={(e) => setForm({ ...form, concept: e.target.value })}
                                            label="Concepto"
                                            error={!!errors.concept}
                                        >
                                            {concepts.map((concept) => (
                                                <MenuItem key={concept} value={concept}>
                                                    {concept}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item size={12}>
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        name="description"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Ingresa la descripción"
                                        error={!!errors.description}
                                        helperText={errors.description}
                                    />
                                </Grid>
                                <Grid item size={12} sx={{textAlign:"center"}}>
                                    <Button sx={buttons} variant="contained" color="primary" type="submit">
                                        Enviar
                                    </Button>
                                </Grid>
                            </Grid>
                    </Grid>
                </Grid>
            </form>

            <Notification
                openSnackbar={openSnackbar}
                snackbarMessage={snackbarMessage}
                snackbarSeverity={snackbarSeverity}
                setOpenSnackbar={setOpenSnackbar}
                loading={loading}
            />
        </div>
    );
}
