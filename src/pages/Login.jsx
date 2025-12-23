import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import { useSnackbar } from '../context/SnackbarContext';

/**
 * Login Page Component
 * Handles user authentication
 */
const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading, login: loginContext } = useAuth();
  const { login: loginAPI, loading } = useAuthHook();
  const { showSuccess, showError } = useSnackbar();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

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

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      // Call API to login
      const { user, token } = await loginAPI({
        username: formData.username,
        password: formData.password,
      });
      
      // Update context with user data
      loginContext(user, token);
      
      // Show success message
      showSuccess('Login successful! Welcome back.');
      
      // Redirect to the page user was trying to access, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
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
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
            width: { xs: '90%', sm: '360px', md: '400px' },
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
            SIGN IN
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
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
                marginTop: 0.5,
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
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '13px',
                  textDecoration: 'underline',
                  color: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                FORGOT PASSWORD?
              </Link>
              <Link
                to="/register"
                style={{
                  fontSize: '13px',
                  textDecoration: 'underline',
                  color: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                CREATE A NEW ACCOUNT
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
