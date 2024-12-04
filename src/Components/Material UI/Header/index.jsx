import React, { useState, useEffect} from 'react';
import {Button, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Link, useNavigate} from 'react-router-dom';
import AuthService from '../../../services/AuthService'; // Asegúrate de importar AuthService

export default function Header() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); 
  }, [localStorage.getItem("token")]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); 
    navigate("/"); 
  };


  return (
    <Grid container sx={{padding: '1% 50px', margin: '1vh 1vh', borderRadius: "0px"}}>
      <Grid item size={2} sx={{display: "flex", justifyContent: "center", gap: 2 }}>
        <Typography>Logo</Typography>
      </Grid>
      <Grid item size={8} sx={{display: "flex", justifyContent: "center", Gap: 4 }}>
        <Typography>Informacion</Typography>
        <Typography>Informacion 2</Typography>
        <Typography>Informacion 3</Typography>
      </Grid>
      <Grid item size={2} Sx={{display: "flex", justifyContent: "center", Gap: 2 }}>
        {isAuthenticated ? (
          <Button variant="contained" color="primary" onClick={handleLogout}>
            <Typography sx={{ color: '#FFFFFF' }}>Logout</Typography>
          </Button>
        ) : (
          <Typography>Botones de Inicio De Sesion</Typography>
        )}
      </Grid>
    </Grid>
  );
}