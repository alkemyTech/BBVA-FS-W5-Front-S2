import React, { useState, useEffect, useRef } from "react";
import api from "../../../services/api";
import Chart from 'chart.js/auto';

export default function Graphics() {
    const [accountData, setAccountData] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);

    const chartContainer = useRef(null);
    const chartInstance = useRef(null);

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
    }, [accountData]);

    useEffect(() => {
        if (allTransactions.length === 0) {
            return;
        }

        if (chartContainer && chartContainer.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartContainer.current.getContext('2d');
            chartInstance.current = new Chart(ctx, config);
        }
    }, [allTransactions]);

    if (allTransactions.length === 0) {
        return <div>No hay gastos registrados</div>;
    }

    const data = {
        labels: allTransactions.map(transaction => transaction.concept),
        datasets: [{
            label: "Gastos en el mes $",
            data: allTransactions.map(transaction => transaction.amount),
            backgroundColor: [
                'rgb(243, 250, 243)',
                'rgb(200, 234, 201)',
                'rgb(105, 191, 108)',
                'rgb(43, 106, 46)',
                'rgb(33, 70, 36)',
                'rgb(14, 37, 15)',
                'rgb(39, 84, 41)'
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
    };

    return (
        <div>
            <canvas ref={chartContainer}></canvas>
        </div>
    );
}
