import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import Chart from 'chart.js/auto';
import Typography from "@mui/material/Typography"

export default function Graphics() {
    const [accountData, setAccountData] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/accounts/transactions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Datos obtenidos:", response.data);
            setAccountData(response.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
            if (error.response && error.response.status === 401) {
                window.location.href = "/";
            }
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        const transactions = accountData.flatMap(account => account.transactions);
        setAllTransactions(transactions);

        const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        setTotalExpenses(total);
    }, [accountData]);

    useEffect(() => {
        if (allTransactions.length === 0) {
            return;
        }
        const existingChart = document.getElementById('myChart');
        if (existingChart) {
            const ctx = existingChart.getContext('2d');
            const chartInstance = Chart.getChart(ctx);
            if (chartInstance) {
                chartInstance.destroy();
            }
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: allTransactions.map(transaction => transaction.concept),
                datasets: [{
                    label: "Gastos en el mes $",
                    data: allTransactions.map(transaction => transaction.amount),
                    backgroundColor: [
                        'rgb(144, 238, 144)',  // Verde claro
                        'rgb(0, 255, 127)',    // Verde lima
                        'rgb(50, 205, 50)',    // Verde manzana
                        'rgb(34, 139, 34)',    // Verde oliva oscuro
                        'rgb(0, 100, 0)',      // Verde oscuro
                        'rgb(124, 252, 0)',    // Verde chiflón
                        'rgb(0, 128, 0)'       // Verde brillante
                    ],
                    hoverOffset: 4
                }]
            }
        });
    }, [allTransactions]);

    if (allTransactions.length === 0) {
        return <div>No hay gastos registrados</div>;
    }

    return (
        <div>
            <Typography sx={{fontWeight:"bold", fontSize:"1.35rem"}}>${totalExpenses.toFixed(2)} ARS</Typography>
            <canvas id="myChart" maxWidth="400" maxHeight="400"></canvas>

        </div>
    );
}