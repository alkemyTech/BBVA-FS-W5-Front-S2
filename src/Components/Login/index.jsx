import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import Grid from "@mui/material/Grid2";
import api from '../../services/Api';
import AuthService from '../../services/AuthService';
import Header from '../Material UI/Header';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import fondo from  '../../assets/img/fondo.png';

export default function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (prop) => (event) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!user.username || !user.password) {
            setError(true);
            setErrorMessage("Por favor, ingrese ambos campos.");
            return;
        }
        try {
            const response = await api.post("http://localhost:8080/auth/login", { username: user.username, password: user.password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", user.username);
            localStorage.setItem("nombre", response.data.nombre);
            localStorage.setItem("apellido", response.data.apellido);
            setError(false); 
            navigate("/home");
        } catch (error) {
            console.error("Error during login:", error.response || error);
            setError(true);
            setErrorMessage("El usuario o la contraseña no existen.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                height: '100vh',
                background:"#f9f9fb",
                marginTop:"50px",
            }}
        >
            <Box
                sx={{
                    width: 1200,
                    height: 700,
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    borderRadius: "17px",
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        padding: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: '1px solid #ddd',
                    }}
                >
                    <Typography
                        sx={{
                            marginBottom: '10px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#016a85',
                            fontSize: '4rem', 
                            letterSpacing: '2px', 

                        }}
                    >
                        Sign In
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            marginBottom: '40px',
                            textAlign: 'center',
                            color: '#3A3A3A',
                        }}
                    >
                        Please enter your details
                    </Typography>
                    <form onSubmit={handleLogin}>
                        <Grid container spacing={3}>
                            <Grid item size={12}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        marginBottom: '5px',
                                        color: '#616161',
                                    }}
                                >
                                    E-mail address
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Type your e-mail"
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailRoundedIcon />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '20px',
                                        },
                                    }}
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    error={error}
                                    helperText={error && errorMessage}
                                />
                            </Grid>
                            <Grid item size={12}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        marginBottom: '5px',
                                        color: '#616161',
                                    }}
                                >
                                    Password
                                </Typography>
                                <TextField
                                    type={values.showPassword ? "text" : "password"} // Muestra u oculta la contraseña
                                    placeholder="Type your password"
                                    fullWidth
                                    variant="outlined"
                                    value={values.password}
                                    onChange={handlePasswordChange("password")}
                                    error={error}
                                    helperText={error && errorMessage}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockRoundedIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '20px',
                                        },
                                    }}
                                />
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        marginTop: '20px',
                                        textAlign: "right",
                                        color: '#016a85',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    I forgot my password
                                </Typography>
                            </Grid>

                            <Grid item size={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        marginTop: '40px',
                                        background: '#016a85',
                                        padding: '15px 35px',
                                        borderRadius: '25px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>

                <Box
                sx={{
                    flex: 2,
                    padding: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    textAlign: 'center',
                    justifyContent: "space-around"
                }}
                >
                <Grid container>
                    <Grid item size={12}>
                    <Typography
                        variant="h3"
                        sx={{
                        color: 'white',
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        letterSpacing: '2px', 
                        fontSize: "54px",
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', 
                        }}
                    >
                        New here?
                    </Typography>
                    </Grid>
                    <Grid item size={12}>
                    <Typography
                        variant="h6"
                        sx={{
                        color: 'white',
                        marginTop: '20px',
                        opacity: 0.85, 
                        fontSize: '2.1rem', 
                        lineHeight: 1.5,
                        marginBottom: '60px',
                        }}
                    >
                        Sign up and discover a great amount of new opportunities
                    </Typography>
                    </Grid>
                    <Grid item size={12}>
                    <Button
                        sx={{
                        marginTop:"190px",
                        background: 'white',
                        width: "60vh",
                        padding: "15px 35px",
                        borderRadius: '25px',
                        color: '#016a85',
                        fontSize: "1rem",
                        fontWeight: "bold",
                        }}
                    >
                        Sign Up
                    </Button>
                    </Grid>
                </Grid>
                </Box>
            </Box>
        </Box>
    );
}
