import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

/**
 * Forgot Password Page Component
 * Handles password reset request
 */
const ForgotPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({
        type: 'success',
        text: 'Password reset link has been sent to your email address.',
      });
      setEmail('');
    }, 1500);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1604830250692-54c16c369b06?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80")',
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
          onClick={() => navigate('/login')}
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
            FORGOT PASSWORD?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '12px', sm: '13px' },
              marginBottom: 2,
              color: 'text.secondary',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          {message && (
            <Alert
              severity={message.type === 'success' ? 'success' : message.type === 'error' ? 'error' : 'info'}
              sx={{ marginBottom: 2, borderRadius: 2 }}
            >
              {message.text}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
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
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Link
                to="/login"
                style={{
                  fontSize: '13px',
                  textDecoration: 'underline',
                  color: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                BACK TO LOGIN
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
