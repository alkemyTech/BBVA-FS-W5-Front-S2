import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Card, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import api from "../../../services/api";
import Notification from "../../Notification/Notification";
import { NumericFormat } from "react-number-format";

export default function TransactionSendForm({form, setForm, loading}) {
    const [errors, setErrors] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    
    
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

   

    

    const concepts = [
        "Servicios",
        "Salud",
        "Transporte",
        "Alquiler",
        "Comida",
        "Otros",
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
                            </Grid>
                    </Grid>
                </Grid>

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
