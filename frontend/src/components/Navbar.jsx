import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(255,255,255,0.88)', borderBottom: '1px solid rgba(107,170,117,0.16)', boxShadow: 'none', backdropFilter: 'blur(16px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          <BrandLogo size="sm" showTagline />
        </Box>

        {/* Auth Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            sx={{ fontWeight: 'bold', textTransform: 'none', fontSize: '1rem', color: '#5C685B', '&:hover': { color: '#6BAA75' } }} 
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
                background: 'linear-gradient(135deg, #6BAA75, #84DD63)', 
                color: '#152110', 
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                borderRadius: '999px',
                px: 3,
                '&:hover': {
                    filter: 'brightness(1.04)',
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
