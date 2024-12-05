import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../../assets/img/logo.png";

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
    <Grid 
      container
      sx={{
        padding: '20px',
        borderRadius: '20px',
        border: "1px solid #43A047",
        backgroundColor: '#FFFFFF', 
        textAlign: 'center',
        margin: '2vh auto', 
        maxWidth: '70%',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        alignItems: 'center'
      }}
    >
      <Grid 
        item 
        size={2}
        sx={{
          display: 'flex',  
          alignItems: 'center', 
          gap: 2, 
        }}
      >  
        <Link to="/home">
          <img src={logo} width={"50px"} alt="Logo" />
        </Link>
        <Typography variant="h3">Lynx</Typography>
        
      </Grid>
      <Grid 
        item 
        size={6}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Link to="/info1" style={{ textDecoration: 'none', color: '#000000' }}>
          <Typography variant="body1">Información</Typography>
        </Link>
        <Link to="/info2" style={{ textDecoration: 'none', color: '#000000' }}>
          <Typography variant="body1">Información 2</Typography>
        </Link>
        <Link to="/info3" style={{ textDecoration: 'none', color: '#000000' }}>
          <Typography variant="body1">Información 3</Typography>
        </Link>
      </Grid>

      <Grid 
        item 
        size={4}
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {isAuthenticated ? (
          <Button
          type="submit"
          variant="contained"
          onClick={handleLogout} 

          sx={{
            background: "#43A047",
            padding: "15px 20px",
            borderRadius: "25px",
            fontWeight: "bold",
            width: "10vw",
          }}
        >
          Logout
            </Button>
        ) : (
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button 
              type="submit"
              variant="contained"
              sx={{
                background: "#43A047",
                padding: "15px 20px",
                borderRadius: "25px",
                fontWeight: "bold",
                width: "10vw",
                mx:2,
              }}
            >
              Login
            </Button>
            <Button 
              type="submit"
              variant="outlined"
              sx={{
                color:"#43A047",
                padding: "15px 20px",
                borderRadius: "25px",
                border:"1px solid #43a047",
                fontWeight: "bold",
                width: "10vw",
              }}
            >
              Register
            </Button>
          </Link>
        )}
      </Grid>
    </Grid>
  );
}
