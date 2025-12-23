import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Grid,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Cancel, 
  Person, 
  Email, 
  Phone, 
  LocationOn,
  CheckCircle,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { useProfile } from '../hooks/useProfile';
import { CircularProgress, Alert } from '@mui/material';

/**
 * Profile Page Component
 * Modern, compact profile page with no overlapping inputs
 */
const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { profile, loading, error, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
      country: 'United States',
    },
  });
  const [saveError, setSaveError] = useState('');

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          zipCode: profile.address?.zipCode || '',
          country: profile.address?.country || 'United States',
        },
      });
    }
  }, [profile]);

  const handleChange = (field) => (event) => {
    if (field === 'address') {
      // Handle nested address fields
      const addressField = event.target.name;
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: event.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    }
    setSaveError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset to saved profile data
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          zipCode: profile.address?.zipCode || '',
          country: profile.address?.country || 'United States',
        },
      });
    }
    setIsEditing(false);
    setSaveError('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const initials = formData.firstName && formData.lastName 
    ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
    : 'U';

  const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Guest User';

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
      
      {/* Hero Header Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #d32f2f 0%, #ff6f00 100%)',
          py: { xs: 3, sm: 4 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '3px solid rgba(255,255,255,0.3)',
                fontSize: { xs: '32px', sm: '40px' },
                fontWeight: 700,
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' }, color: 'white', minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  mb: 0.5,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  lineHeight: 1.2,
                }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                  opacity: 0.95,
                }}
              >
                {formData.email || 'No email provided'}
              </Typography>
            </Box>
            {!isEditing && (
              <IconButton
                onClick={() => setIsEditing(true)}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  width: { xs: 44, sm: 48 },
                  height: { xs: 44, sm: 48 },
                  flexShrink: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Edit />
              </IconButton>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 3, sm: 4 }, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Personal Information Card */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
                  p: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      background: 'linear-gradient(135deg, #d32f2f 0%, #ff6f00 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <Person fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Personal Information
                  </Typography>
                </Box>
                {!isEditing && (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Box>
              
              <Box component="form" onSubmit={handleSave} sx={{ p: 2.5 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  {isEditing && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={handleCancel}
                          size="medium"
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<Save />}
                          size="medium"
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            background: 'linear-gradient(135deg, #d32f2f 0%, #ff6f00 100%)',
                            boxShadow: '0 2px 10px rgba(211, 47, 47, 0.3)',
                            '&:hover': {
                              boxShadow: '0 4px 15px rgba(211, 47, 47, 0.4)',
                            },
                          }}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Paper>

            {/* Address Card */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                mt: 3,
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
                  p: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #d32f2f 0%, #ff6f00 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  <LocationOn fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  Address
                </Typography>
              </Box>
              
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      label="Street Address"
                      name="street"
                      value={formData.address.street}
                      onChange={handleChange('address')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      name="city"
                      value={formData.address.city}
                      onChange={handleChange('address')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Zip Code"
                      name="zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange('address')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Country"
                      name="country"
                      value={formData.address.country}
                      onChange={handleChange('address')}
                      disabled={!isEditing}
                      fullWidth
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  </Grid>
                  {saveError && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                        {saveError}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Stats Sidebar */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: { md: 20 },
                height: 'fit-content',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '1.1rem' }}>
                  Account Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 28, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      Account Verified
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      Active
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2.5 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      background: 'linear-gradient(135deg, #d32f2f 0%, #ff6f00 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <Person fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      Member Since
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      {new Date().getFullYear()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Profile;
