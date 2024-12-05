import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../../assets/img/lynxlogo.png";
import nombre from "../../../assets/img/lynxnombre2.png";

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
        backgroundColor: '#FFFFFF', 
        textAlign: 'center',
        padding:"15px 0px",
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        justifyContent:"space-evenly",
        display:"flex",

      }}
    >
      <Grid item size={2}sx={{ display: 'flex',  alignItems: 'center',  }}>  
        <Link to="/home">
          <img src={logo} width={"100px"} alt="Logo" />
        </Link>
        <Link to="/home">
          <img src={nombre} width={"100px"} alt="Marca" />
        </Link>
      
      </Grid>
      <Grid item size={8}sx={{ display: 'flex',  alignItems: 'center',  }}>
        <Link to="/info1" style={{ textDecoration: 'none', color: '#000000' }}>
          <Typography variant="body1"></Typography>
        </Link>
        <Link to="/info2" style={{ textDecoration: 'none', color: '#000000' }}>
          <Typography variant="body1">Transacciones</Typography>
        </Link>
        <Link to="/info3" style={{ textDecoration: 'none', color: '#000000' }}>
          <Typography variant="body1">Inversiones</Typography>
        </Link>
      </Grid>
      <Grid 
        item 
        size={2}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap:1,
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
                background: "#71DB77",
                borderRadius: "25px",
                fontWeight: "bold",
                width: "10vw",
              }}
            >
              Login
            </Button>
            <Button 
              type="submit"
              sx={{
                color:"#71DB77",
                borderRadius: "25px",
                fontWeight: "bold",
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
