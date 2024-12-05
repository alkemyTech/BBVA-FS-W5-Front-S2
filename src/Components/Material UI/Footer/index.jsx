import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PinterestIcon from '@mui/icons-material/Pinterest';

export default function Footer() {
  return (
    <Grid container spacing={3} sx={{ justifyContent: "space-between", textAlign: "center", backgroundColor: "#43A047", p: 2, color: "#fff" }}>
      <Grid item size={4} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "200px" }}>
        <Grid container spacing={2} sx={{ borderRight: "1px solid #FFFFFF", flexGrow: 1 }}>
          <Grid item size={12}>
            <Typography variant="h6">Contacto</Typography>
          </Grid>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <EmailIcon sx={{ mr: 1, fontSize: "20px" }} />
            <Typography>Correo: marca@billetera.com</Typography>
          </Grid>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <PhoneIcon sx={{ mr: 1, fontSize: "20px" }} />
            <Typography>Teléfono: +54 11 1234-5678</Typography>
          </Grid>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <AccessTimeIcon sx={{ mr: 1, fontSize: "20px" }} />
            <Typography>Horario: Lun-Vie 9:00 a 18:00</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={4} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "200px" }}>
        <Grid container spacing={2} sx={{ borderRight: "1px solid #FFFFFF", flexGrow: 1 }}>
          <Grid item size={12}>
            <Typography variant="h6">Navegación</Typography>
          </Grid>
          <Grid item size={12}>
            <Link href="/terms" underline="hover" color="#fff">Términos y condiciones</Link>
          </Grid>
          <Grid item size={12}>
            <Link href="/privacy" underline="hover" color="#fff">Política de privacidad</Link>
          </Grid>
          <Grid item size={12}>
            <Link href="/faq" underline="hover" color="#fff">Preguntas frecuentes</Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={4} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "200px" }}>
        <Grid container spacing={2} sx={{ justifyContent: "center", flexGrow: 1 }}>
          <Grid item size={12}>
            <Typography variant="h6">Redes</Typography>
          </Grid>
          <Grid item size={12}>
            <FacebookIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
            <TwitterIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
            <InstagramIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
          </Grid>
          <Grid item size={12}>
            <PinterestIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
            <LinkedInIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
            <YouTubeIcon sx={{ color: "#fff", fontSize: "36px", mx: 1 }} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={12}>
        <Typography variant="body2">
          © 2024 . Todos los derechos reservados.
        </Typography>
      </Grid>
    </Grid>
  );
}