import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Footer() {
  return (
    <Grid container sx={{ display:"flex", justifyContent: "space-around",textAlign:"center",backgroundColor: "#5B9C96", color: "#fff", padding: "30px 50px" }}>
      <Grid item size={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Contacto</Typography>
        <Grid container sx={{ gap: 2, justifyContent: "center" }}>
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <EmailIcon sx={{ color: "#fff", fontSize: "24px", mr: 1 }} />
            <Typography>Correo: marca@billetera.com</Typography>

          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIcon sx={{ color: "#fff", fontSize: "24px", mr: 1 }} />
            <Typography>Telefono: +54 11 1234-5678</Typography>
          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <AccessTimeIcon sx={{ color: "#fff", fontSize: "24px", mr: 1 }} />
            <Typography>Horario: Lun-Vie 9:00 a 18:00</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={3} sx={{display:"flex", flexDirection:"column", gap:2}}>
        <Typography variant="h6">Navegación</Typography>
        <Link href="/terms" underline="hover" color="#fff">Términos y condiciones</Link>
        <Link href="/privacy" underline="hover" color="#fff">Política de privacidad</Link>
        <Link href="/faq" underline="hover" color="#fff">Preguntas frecuentes</Link>
      </Grid>
      <Grid item size={3} sx={{display:"flex", flexDirection:"column", gap:2}}>
        <Typography variant="h6">Seguinos</Typography>
        <Grid container>
          <Grid item size={12}>
            <FacebookIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
            <TwitterIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
          </Grid>
          <Grid item size={12}>
            <InstagramIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
            <LinkedInIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={12} sx={{ textAlign: "center", mt: 5, alignItems:"center",}}>
        <Typography variant="body2">
          © 2024 Billetera Virtual. Todos los derechos reservados.
        </Typography>
      </Grid>

    </Grid>
  );
}