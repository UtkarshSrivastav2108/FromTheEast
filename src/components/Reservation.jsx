import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Container,
  Paper,
} from '@mui/material';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    persons: '',
    date: '',
    time: '',
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    alert('Reservation submitted successfully!');
  };

  return (
    <Box
      sx={{
        padding: { xs: '48px 16px', md: '80px 24px' },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 700,
              marginBottom: 2,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Make a Reservation
          </Typography>
          <Box
            sx={{
              width: '80px',
              height: '4px',
              backgroundColor: 'primary.main',
              margin: '0 auto',
              borderRadius: '2px',
            }}
          />
          <Typography
            variant="body1"
            sx={{
              marginTop: 3,
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', md: '1rem' },
              maxWidth: '600px',
              margin: '24px auto 0',
            }}
          >
            Book your table and enjoy an authentic dining experience
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, md: 5 },
            borderRadius: '16px',
            backgroundColor: 'background.paper',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={formData.contact}
                  onChange={handleChange('contact')}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Number of Guests</InputLabel>
                  <Select
                    value={formData.persons}
                    onChange={handleChange('persons')}
                    label="Number of Guests"
                    sx={{
                      borderRadius: '12px',
                    }}
                  >
                    <MenuItem value={1}>1 Guest</MenuItem>
                    <MenuItem value={2}>2 Guests</MenuItem>
                    <MenuItem value={3}>3 Guests</MenuItem>
                    <MenuItem value={4}>4 Guests</MenuItem>
                    <MenuItem value={5}>5+ Guests</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={formData.date}
                  onChange={handleChange('date')}
                  variant="outlined"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  value={formData.time}
                  onChange={handleChange('time')}
                  variant="outlined"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(211, 47, 47, 0.3)',
                    transition: 'all 0.3s ease',
                    marginTop: 2,
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 24px rgba(211, 47, 47, 0.4)',
                    },
                  }}
                >
                  Book My Table
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Reservation;
