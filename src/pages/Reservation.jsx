import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Announcement from '../components/Announcement';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useReservations } from '../hooks/useReservations';
import { CircularProgress, Alert } from '@mui/material';

/**
 * Reservation Page Component
 * Modern card-based booking form
 */
const Reservation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { createReservation, loading } = useReservations();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    date: '',
    time: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
  };

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.guests || !formData.date || !formData.time) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await createReservation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests: parseInt(formData.guests, 10),
        date: formData.date,
        time: formData.time,
      });
      
      setSuccess('Reservation created successfully!');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        guests: '',
        date: '',
        time: '',
      });
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create reservation. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Announcement />
      <Navbar />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: { xs: 3, md: 4 },
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: 'text.primary',
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: 'text.primary',
            }}
          >
            Make a Reservation
          </Typography>
        </Box>

        {/* Form Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', md: '1rem' },
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Book your table and enjoy an authentic dining experience with us
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, md: 5 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {success}
              </Alert>
            )}
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
                      borderRadius: 2,
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
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Number of Guests</InputLabel>
                  <Select
                    value={formData.guests}
                    onChange={handleChange('guests')}
                    label="Number of Guests"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value={1}>1 Guest</MenuItem>
                    <MenuItem value={2}>2 Guests</MenuItem>
                    <MenuItem value={3}>3 Guests</MenuItem>
                    <MenuItem value={4}>4 Guests</MenuItem>
                    <MenuItem value={5}>5 Guests</MenuItem>
                    <MenuItem value={6}>6 Guests</MenuItem>
                    <MenuItem value={7}>7+ Guests</MenuItem>
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
                  inputProps={{
                    min: new Date().toISOString().split('T')[0],
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
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
                      borderRadius: 2,
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
                  disabled={loading}
                  sx={{
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
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
                  {loading ? 'Booking...' : 'Book My Table'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Reservation;
