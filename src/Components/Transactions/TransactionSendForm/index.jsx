import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Card, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function TransactionSendForm() {
    const [errors, setErrors] = useState("");
    const [form, setForm] = useState({
        destinationCbu: "",
        amount: "",
        currency: "",
        description: "",
        concept: ""
    });
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setForm({
            destinationCbu: "",
            amount: "",
            currency: "",
            description: "",
            concept: ""
        });
        setErrors("");
        setSummary(null);
        setLoading(false);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "amount") {
            const formattedValue = value.replace(/,/g, '').replace('.', ',');
            setForm({
                ...form,
                [name]: formattedValue
            });
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const formatAmountForServer = (amount) => {
        return amount.replace(/,/g, '.');
    };

    const sendForm = async (e) => {
        e.preventDefault();
        const { destinationCbu, amount, currency, description, concept } = form;

        if (!destinationCbu || !amount || !currency || !description || !concept) {
            setErrors("Todos los campos son obligatorios");
            return;
        }

        if (isNaN(amount.replace(/,/g, '')) || parseFloat(amount.replace(/,/g, '')) <= 0) {
            setErrors("El monto debe ser un número positivo");
            return;
        }

        setLoading(true);
        setErrors("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Token no encontrado");
                window.location.href = "/";
                return;
            }

            const response = await api.post("/transactions/send", {
                destinationCbu,
                amount: formatAmountForServer(amount),
                currency,
                description,
                concept
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setForm(response.data);
            setSummary(response.data);
            setLoading(false);
            navigate("/home");
        } catch (error) {
            console.error("Error al enviar la transacción:", error);
            setLoading(false);
            if (error.response && error.response.data && error.response.data.message) {
                setErrors(error.response.data.message);
            } else {
                setErrors("Ha ocurrido un error al enviar la transacción");
            }
        }
    };

    const concepts = ["Servicios",
        "Salud",
        "Transporte",
        "Alquiler",
        "Comida",
        "Otros",
        "Deposito",
    ]; 

    const currencies = ["ARS",
        "USD",
    ]; 

    const buttons = {
        backgroundColor: "#9cd99e",
        borderRadius: "25px",
        padding: "6px 16px",
        color: "#2b6a2f",
        fontWeight: "bold",
    };

    const cardStyle = {
        margin: "8px",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderTop: "4px solid #9cd99e",
        maxWidth: "500px",
        width: "100%",  
    };

    const summaryStyle = {
        backgroundColor: "#f9f9f9",
        padding: "16px",
        borderRadius: "5px",
        margin: "16px 0",
        border: "1px solid #ddd"
    };

    return (
        <form onSubmit={sendForm}>
            <Grid container justifyContent="center" alignItems="center" sx={{ mt: 8, p: 2 }}>
                <Grid item size={12} sm={10} md={8} lg={6} xl={4}>
                    <Card sx={cardStyle}>
                        <Grid container spacing={2} p={2}>
                            <Grid item size={12}>
                                <Typography variant="h5" align="center">
                                    Enviar Transacción
                                </Typography>
                            </Grid>
                            <Grid item size={12}>
                                <Typography variant="body1" color="text.secondary">
                                    Por favor, completa los siguientes campos para enviar tu transacción.
                                </Typography>
                            </Grid>
                            <Grid item size={12}>
                                <TextField
                                    fullWidth
                                    label="CBU Destino"
                                    name="destinationCbu"
                                    value={form.destinationCbu}
                                    onChange={handleChange}
                                    placeholder="Ingresa el CBU"
                                    
                                />
                            </Grid>
                            <Grid item size={5} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Monto"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Ingresa el monto"
                                    slotProps={{ inputMode: 'decimal', pattern: '[0-9]+([.,][0-9]+)?' }}
                                    
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
                                        onChange={handleChange}
                                        label="Moneda"
                                        
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
                                        onChange={handleChange}
                                        label="Concepto"
                                        
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
                                    onChange={handleChange}
                                    placeholder="Ingresa la descripción"
                                    
                                />
                            </Grid>
                            <Grid item size={12}>
                                <Button
                                    sx={buttons}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    >
                                     Enviar
                                </Button>
                            </Grid>
                            {errors && (
                                <Grid item size={12}>
                                    <Typography color="error" align="center">
                                        {errors}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </form>
    );
}