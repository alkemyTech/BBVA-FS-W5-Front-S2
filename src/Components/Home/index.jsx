import Grid from '@mui/material/Grid2';
import { Typography, Card, CardContent, Box } from "@mui/material";
import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Prestamos from "../../assets/img/Prestamos.jpg";
import PlazosFijos from "../../assets/img/Plazos Fijos.jpg";
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';




export default function Home() {
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token no encontrado");
        window.location.href = "/";
        return;
      }

      const response = await api.get("/accounts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Datos obtenidos:", response.data);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const cardStyle = {
    margin: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderTop: "4px solid #9cd99e",
  };

  const buttons = {
    backgroundColor: "#9cd99e",
    borderRadius: "25px",
    padding:"6px 16px",
    color: "#2b6a2f",
    fontWeight:"bold",
  };

  return (
    <Grid container spacing={12} sx={{ display: "flex", justifyContent: "cener", padding: 1,  }}>
      <Grid item size={9}>
        <Grid container  sx={{marginTop: 1, padding: "10px", justifyContent: "center", }}>
          {accounts.map((account) => (
            <Grid item size={6} key={account.id}>
              <Card sx={cardStyle}>
              <CardHeader
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
                action={
                    <IconButton arial-label="settings">
                      <BadgeOutlinedIcon sx={{ color: "#2b6a2f", fontSize: "1.5rem" }} />
                    </IconButton>
                } 
                title={
                  <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold" }}>
                    {`Cuenta en ${account.currency}`}
                  </Typography>
                }
              />
              <CardContent>
                <Typography sx={{ fontSize: "1.25rem", color: "#3A3A3A", marginBottom: "8px" }}>
                  Dinero disponible
                </Typography>
                <Typography sx={{ fontSize: "2rem", color: "#000000", fontWeight: "bold" }}>
                  ${account.balance}
                </Typography>
              </CardContent>
                <Grid container size={12} sx={{ gap:2, textAlign: "center", marginTop: 2,padding: "10px", justifyContent: "center" }}>
                  <Grid item size={5}>
                    <Typography variant="body2" fullWidth sx={buttons}>Depositar</Typography>
                  </Grid>
                  <Grid item size={5}>
                    <Typography variant="body2" sx={buttons}>Transferir</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
          <Grid item size={12}>
            <Grid container size={12} sx={{ gap: 2, textAlign: "center", marginTop: 2, padding: "10px", justifyContent: "center" }}>
              <Grid item size={5}>
                <Card>
                  <CardMedia
                    component="img"
                    alt="Plazos fijos"
                    height="140"
                    image={PlazosFijos}  
                    width="100%"
                    sx={{ objectFit: 'cover' }}  
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Plazos fijos
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ¡Hacé crecer tu dinero hoy!
                      Descubrí la seguridad y rentabilidad de nuestro plazo fijo.
                      Invertí fácil y seguro, ¡tu futuro te lo agradecerá!
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item size={5}>
                <Card>
                  <CardMedia
                    component="img"
                    alt="Plazos fijos"
                    height="140"
                    image={PlazosFijos}  
                    width="100%"
                    sx={{ objectFit: 'cover' }}  
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Plazos fijos
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ¡Hacé crecer tu dinero hoy!
                      Descubrí la seguridad y rentabilidad de nuestro plazo fijo.
                      Invertí fácil y seguro, ¡tu futuro te lo agradecerá!
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={3}>
        <Typography>Transacciones</Typography>
      </Grid>
    </Grid>
  );
}