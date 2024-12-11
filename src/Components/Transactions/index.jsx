import React from 'react'
import Grid from "@mui/material/Grid2"
import { Card, Typography, CardHeader, CardContent} from '@mui/material'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

export default function Transactions() {
  return (
    <Grid container>
      <Grid item size={12}>
        <Card>
          <CardHeader
          title={
            <Typography sx={{ fontSize: "1.35rem", color: "#2b6a2f", fontWeight: "bold",}}>
              Elegi a que cuenta transferir
            </Typography>
          }
          />
          <CardContent sx={{padding:"10px"}}>
            <Grid container sx={{alignItems:"center", textAlign:"center",borderTop:"1px solid #43A047",p:"10px 12px"}}>
              <Grid item size={3}>
                <PersonAddAltRoundedIcon sx={{fontSize:"30px"}}/>
              </Grid>
              <Grid item size={6}>
                <Typography sx={{fontSize:"1rem"}}>Nueva cuenta</Typography>
                <Typography sx={{fontSize:"0.85rem", color:"#3A3A3A"}}>Con CBU o alias.</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
      </Grid>
      <Grid item size={12}>
        <Typography>Hola</Typography>
      </Grid>
    </Grid>
  )
}
