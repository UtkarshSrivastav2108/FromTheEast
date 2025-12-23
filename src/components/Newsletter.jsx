import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, alpha } from '@mui/material';
import { Send } from '@mui/icons-material';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <Box
      sx={{
        padding: { xs: '48px 16px', md: '80px 24px' },
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(211, 47, 47, 0.05) 0%, transparent 50%)',
        },
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              marginBottom: 2,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Stay Updated
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              fontWeight: 400,
              marginBottom: 4,
              color: 'text.secondary',
              maxWidth: '600px',
              margin: '0 auto 32px',
            }}
          >
            Get the latest updates on new dishes, special offers, and exclusive events delivered to your inbox.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <TextField
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              required
              fullWidth
              sx={{
                backgroundColor: 'white',
                borderRadius: '12px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<Send />}
              sx={{
                padding: { xs: '14px 24px', sm: '14px 32px' },
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '12px',
                backgroundColor: 'primary.main',
                color: 'white',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(211, 47, 47, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 24px rgba(211, 47, 47, 0.4)',
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Newsletter;
