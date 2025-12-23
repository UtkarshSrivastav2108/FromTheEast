import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Announcement from '../components/Announcement';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { CircularProgress, Alert } from '@mui/material';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  
  // Get coupon discount from navigation state
  const appliedCoupon = location.state?.appliedCoupon || null;
  const couponDiscount = location.state?.discount || 0;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'card',
  });
  const [error, setError] = useState('');

  // Extract cart items
  const cartItems = cart?.items || [];
  
  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = getTotal();
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  const finalTotal = subtotal + deliveryFee - couponDiscount;

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city || 
        !formData.zipCode || !formData.country) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Prepare order items for API
      const orderItems = cartItems.map(item => ({
        product: item.product?._id || item.product || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.product?.image,
      }));

      // Create order via API
      const order = await createOrder({
        items: orderItems,
        subtotal,
        deliveryFee,
        discount: couponDiscount,
        total: finalTotal,
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      });
      
      // Clear cart
      await clearCart();
      
      // Show success and navigate
      alert(`Order placed successfully! Order Number: ${order.orderNumber || order._id}`);
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    }
  };

  if (cartLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0) {
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
          <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button variant="contained" onClick={() => navigate('/cart')}>
              Go to Cart
            </Button>
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

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
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <IconButton
          onClick={() => navigate('/cart')}
          sx={{ marginBottom: 2 }}
        >
          <ArrowBack />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            Back to Cart
          </Typography>
        </IconButton>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            marginBottom: 4,
            fontSize: { xs: '1.75rem', md: '2rem' },
          }}
        >
          Checkout
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column - Form */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                padding: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                marginBottom: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 3 }}>
                Delivery Information
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {error}
                    </Alert>
                  </Grid>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
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
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={formData.address}
                      onChange={handleChange('address')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.city}
                      onChange={handleChange('city')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      value={formData.zipCode}
                      onChange={handleChange('zipCode')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={formData.country}
                        onChange={handleChange('country')}
                        label="Country"
                        sx={{
                          borderRadius: '12px',
                        }}
                      >
                        <MenuItem value="India">India</MenuItem>
                        <MenuItem value="USA">USA</MenuItem>
                        <MenuItem value="UK">UK</MenuItem>
                        <MenuItem value="Canada">Canada</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                padding: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 3 }}>
                Payment Method
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={formData.paymentMethod}
                  onChange={handleChange('paymentMethod')}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Credit/Debit Card"
                  />
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label="PayPal"
                  />
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                padding: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 100,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ marginBottom: 2 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.name} × {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ marginY: 2 }} />

              <Box sx={{ marginBottom: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{subtotal.toFixed(2)}
                  </Typography>
                </Box>
                {couponDiscount > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Discount ({appliedCoupon})
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      -₹{couponDiscount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Delivery Fee
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {deliveryFee === 0 ? (
                      <Typography
                        component="span"
                        sx={{ color: 'success.main', fontWeight: 600 }}
                      >
                        Free
                      </Typography>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ marginY: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ₹{finalTotal.toFixed(2)}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={orderLoading}
                sx={{
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  backgroundColor: 'primary.main',
                  boxShadow: '0 4px 16px rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 24px rgba(211, 47, 47, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Checkout;
