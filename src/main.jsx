// src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; 
import { Provider } from 'react-redux';
import { store } from '../src/services/Store.jsx'; // Importa el store
import './index.css';
import App from './App.jsx';

const theme = createTheme({
  typography: {
    fontFamily: 'Mulish, sans-serif',
  },
  grid: {
    bgColor: "background.paper",
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
