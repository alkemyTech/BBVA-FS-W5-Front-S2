import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link, useNavigate } from 'react-router-dom';


export default function Header() {

    
  
  return (
    <Grid container sx={{padding: '1% 50px', margin: '1vh 1vh', borderRadius:"0px"}}>
        <Grid item size={2} sx={{display: "flex", justifyContent:"center", gap:2,}}>
            <Typography>Logo</Typography>
        </Grid>
        <Grid item size={8} sx={{display: "flex", justifyContent:"center", gap:4,}}>
            <Typography>Informacion</Typography>
            <Typography>Informacion 2</Typography>
            <Typography>Informacion 3</Typography>
        </Grid>
        <Grid item size={2} sx={{display: "flex", justifyContent:"center", gap:2,}}>
            <Typography>Botones de inicio de sesion</Typography>
        </Grid>
        
    </Grid>
  );
}
