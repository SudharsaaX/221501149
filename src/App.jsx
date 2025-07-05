import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Button, Box, IconButton } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link as RouterLink } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import RedirectHandler from './components/RedirectHandler';


function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: {
                  main: '#90caf9',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#e0e0e0',
                  secondary: '#bdbdbd',
                },
              }
            : {
                primary: {
                  main: '#1976d2',
                },
                background: {
                  default: '#fafafa',
                  paper: '#ffffff',
                },
              }),
        },
      }),
    [mode]
  );



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar sx={{ gap: 2 }}>
                <Button color="inherit" component={RouterLink} to="/">
                  Home
                </Button>
                <Button color="inherit" component={RouterLink} to="/stats">
                  Statistics
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="inherit" onClick={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))}>
                  {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Toolbar>
            
          </AppBar>
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/:shortcode" element={<RedirectHandler />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;