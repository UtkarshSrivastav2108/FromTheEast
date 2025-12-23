import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ForgotPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

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
        background: `linear-gradient(
          rgba(255, 255, 255, 0.5),
          rgba(255, 255, 255, 0.5)
        ),
        url("https://images.unsplash.com/photo-1604830250692-54c16c369b06?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80") center`,
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            width: { xs: '85%', sm: '30%' },
            padding: 3.75,
            backgroundColor: 'white',
            borderRadius: '10px',
            margin: '0 auto',
          }}
        >
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#666',
              textDecoration: 'none',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            <ArrowBack sx={{ fontSize: '18px' }} />
            Back to Login
          </Link>
          <Typography variant="h4" sx={{ fontSize: '28px', fontWeight: 300, marginBottom: 1.25 }}>
            Forgot Password?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '14px',
              marginBottom: 3.75,
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          {message && (
            <Alert
              severity={message.type === 'success' ? 'success' : message.type === 'error' ? 'error' : 'info'}
              sx={{ marginBottom: 2.5 }}
            >
              {message.text}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                padding: '15px 25px',
                backgroundColor: '#d32f2f',
                color: 'white',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
