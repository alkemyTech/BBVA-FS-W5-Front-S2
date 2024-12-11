import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
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
  const iconStyle = {
    mx: 1,
    fontSize: "18px",
    width: "20px",
    height: "20px",
  };

  return (
    <Grid
      container
      sx={{
        justifyContent: "space-between",
        textAlign: "center",
        backgroundColor: "#43A047",
        p: "15px 0px",
        color: "#fff",
      }}
    >
      <Grid item size={12} sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>Contacto</Typography>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>Navegación</Typography>
        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>Redes</Typography>
      </Grid>
      <Grid item size={4} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Grid container sx={{ borderRight: "1px solid #FFFFFF", flexGrow: 1, alignItems: "center" }}>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "14px" }}>Horario: Lun a Vie 9:00 a 18:00</Typography>
          </Grid>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "14px" }}>Telefono: +54 11 1234-5678</Typography>
          </Grid>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "14px" }}>Email: lynx@virtual.com</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={4} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Grid container sx={{ borderRight: "1px solid #FFFFFF", flexGrow: 1, alignItems: "center" }}>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "14px" }}>Términos y condiciones</Typography>
          </Grid>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "14px" }}>Política de privacidad</Typography>
          </Grid>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ fontSize: "14px" }}>Preguntas frecuentes</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={4} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Grid container sx={{ flexGrow: 1, justifyContent: "center" }}>
          <Grid item size={12} sx={{ display: "flex", justifyContent: "center", alignItems:"center", gap: 1 }}>
            <FacebookIcon sx={iconStyle} />
            <TwitterIcon sx={iconStyle} />
            <InstagramIcon sx={iconStyle} />
          </Grid>
          <Grid item size={12} sx={{ display: "flex", alignItems:"center" , justifyContent: "center", gap: 1 }}>
            <PinterestIcon sx={iconStyle} />
            <LinkedInIcon sx={iconStyle} />
            <YouTubeIcon sx={iconStyle} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item size={12} sx={{ mt: 1 }}>
        <Typography variant="body2" sx={{ fontSize: "12px" }}>
          © 2024 . Todos los derechos reservados.
        </Typography>
      </Grid>
    </Grid>
  );
}
