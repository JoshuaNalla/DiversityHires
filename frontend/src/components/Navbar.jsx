import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000', borderBottom: '2px solid #1E3A8A', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Placeholder Logo / Name */}
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ fontWeight: '900', color: '#60A5FA', cursor: 'pointer', letterSpacing: '1px' }}
          onClick={() => navigate('/')}
        >
          Placeholder
        </Typography>

        {/* Auth Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            sx={{ fontWeight: 'bold', textTransform: 'none', fontSize: '1rem', color: '#D1D5DB', '&:hover': { color: '#FFF' } }} 
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
                backgroundColor: '#3B82F6', 
                color: '#fff', 
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                borderRadius: '8px',
                px: 3,
                '&:hover': {
                    backgroundColor: '#2563EB',
                }
            }}
            onClick={() => navigate('/signup')}
          >
            Sign up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
