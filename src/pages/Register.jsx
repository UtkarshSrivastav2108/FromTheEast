import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useAuth as useAuthHook } from '../hooks/useAuth';

/**
 * Register Page Component
 * Handles user registration and auto-login
 */
const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const { register, loading } = useAuthHook();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  /**
   * Handle form field changes
   * @param {string} field - Field name
   * @returns {Function} Change handler
   */
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    setError('');
  };

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.username || 
        !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // Call API to register
      const { user, token } = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // Auto-login after registration
      loginContext(user, token);
      
      // Redirect to home page
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1600953983491-ddd1ddf2b9e4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1669&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: { xs: 16, sm: 24 },
            left: { xs: 16, sm: 24 },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            zIndex: 2,
          }}
        >
          <ArrowBack />
        </IconButton>
        <Paper
          elevation={3}
          sx={{
            width: { xs: '90%', sm: '460px', md: '520px' },
            maxWidth: '100%',
            padding: { xs: 2, sm: 2.5 },
            backgroundColor: 'white',
            margin: '0 auto',
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h5"
            sx={{
              fontSize: { xs: '18px', sm: '20px' },
              fontWeight: 600,
              marginBottom: 2,
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}
          >
            CREATE AN ACCOUNT
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Grid container spacing={1.5}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="name" 
                  variant="outlined" 
                  fullWidth 
                  required
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="last name" 
                  variant="outlined" 
                  fullWidth 
                  required
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="username" 
                  variant="outlined" 
                  fullWidth 
                  required
                  value={formData.username}
                  onChange={handleChange('username')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="email" 
                  type="email" 
                  variant="outlined" 
                  fullWidth 
                  required
                  value={formData.email}
                  onChange={handleChange('email')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={handleChange('password')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="confirm password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '10px', sm: '11px' },
                    margin: '12px 0px',
                    color: 'text.secondary',
                    lineHeight: 1.5,
                  }}
                >
                  By creating an account, I consent to the processing of my personal data in
                  accordance with the <strong>PRIVACY POLICY</strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '13px',
                    textDecoration: 'underline',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'block',
                    textAlign: 'center',
                    marginBottom: '8px',
                  }}
                >
                  ALREADY HAVE AN ACCOUNT?
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    padding: { xs: '10px 20px', sm: '12px 24px' },
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'CREATING...' : 'CREATE'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
