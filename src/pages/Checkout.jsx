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
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
  alpha,
  useTheme,
} from '@mui/material';
import { ArrowBack, LocalOffer, DeleteOutline } from '@mui/icons-material';
import Announcement from '../components/Announcement';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useCoupons, useCouponValidation } from '../hooks/useCoupons';
import { useSnackbar } from '../context/SnackbarContext';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  const { showSuccess, showError } = useSnackbar();
  const { coupons, loading: couponsLoading, error: couponsError } = useCoupons();
  const { validateCoupon, loading: validatingCoupon } = useCouponValidation();
  
  // Get coupon discount from navigation state or use local state
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.appliedCoupon || null);
  const [appliedCouponData, setAppliedCouponData] = useState(location.state?.appliedCouponData || null);
  const [couponDiscount, setCouponDiscount] = useState(location.state?.discount || 0);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

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

  // Re-validate coupon when subtotal changes
  useEffect(() => {
    if (appliedCouponData && subtotal > 0) {
      validateCoupon(appliedCouponData.code, subtotal)
        .then((result) => {
          setCouponDiscount(result.discount);
          if (result.discount === 0 && subtotal < appliedCouponData.minAmount) {
            setCouponError(`Minimum order of ₹${appliedCouponData.minAmount} required for this coupon`);
          } else {
            setCouponError('');
          }
        })
        .catch(() => {
          // Error already set by validation
        });
    }
  }, [subtotal, appliedCouponData, validateCoupon]);

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  /**
   * Apply coupon code
   */
  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const result = await validateCoupon(couponCode.trim(), subtotal);
      setAppliedCoupon(result.coupon.code);
      setAppliedCouponData(result.coupon);
      setCouponDiscount(result.discount);
      setCouponSuccess(`Coupon "${result.coupon.code}" applied successfully!`);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
      setAppliedCouponData(null);
      setCouponDiscount(0);
    }
  };

  /**
   * Remove applied coupon
   */
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setAppliedCouponData(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  };

  /**
   * Apply coupon from available coupons list
   */
  const handleApplyCouponFromList = async (coupon) => {
    setCouponError('');
    setCouponSuccess('');
    setCouponCode(coupon.code);
    
    try {
      const result = await validateCoupon(coupon.code, subtotal);
      setAppliedCoupon(result.coupon.code);
      setAppliedCouponData(result.coupon);
      setCouponDiscount(result.discount);
      setCouponSuccess(`Coupon "${result.coupon.code}" applied successfully!`);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
      setAppliedCouponData(null);
      setCouponDiscount(0);
    }
  };

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
      
      // Show success message
      const orderNumber = order.data?.orderNumber || order.orderNumber || order._id;
      showSuccess(`Order placed successfully! Order Number: ${orderNumber}`);
      
      // Navigate to orders page
      navigate('/orders');
    } catch (err) {
      const errorMessage = err.message || 'Failed to place order. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
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

              {/* Coupon Section */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <LocalOffer sx={{ fontSize: 16 }} />
                  Available Coupons
                </Typography>

                {/* Available Coupons List */}
                {couponsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : couponsError ? (
                  <Alert severity="error" sx={{ fontSize: '0.75rem', mb: 1 }}>
                    Failed to load coupons
                  </Alert>
                ) : coupons.length > 0 ? (
                  <Box sx={{ mb: 1.5, maxHeight: '150px', overflowY: 'auto' }}>
                    {coupons.map((coupon) => {
                      const isEligible = subtotal >= coupon.minAmount;
                      const isApplied = appliedCoupon === coupon.code;
                      
                      return (
                        <Box
                          key={coupon._id || coupon.code}
                          sx={{
                            p: 1,
                            mb: 0.5,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: isApplied ? 'success.main' : isEligible ? 'primary.main' : 'divider',
                            backgroundColor: isApplied
                              ? alpha(theme.palette.success.main, 0.1)
                              : isEligible
                              ? alpha(theme.palette.primary.main, 0.08)
                              : alpha(theme.palette.grey[500], 0.05),
                            cursor: isEligible && !isApplied ? 'pointer' : 'not-allowed',
                            opacity: isEligible ? 1 : 0.6,
                            transition: 'all 0.2s ease',
                            '&:hover': isEligible && !isApplied
                              ? {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                  borderColor: 'primary.dark',
                                }
                              : {},
                          }}
                          onClick={() => {
                            if (isEligible && !isApplied) {
                              handleApplyCouponFromList(coupon);
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: isApplied ? 'success.main' : isEligible ? 'primary.main' : 'text.secondary',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {coupon.code}
                                </Typography>
                                {isApplied && (
                                  <Chip
                                    label="Applied"
                                    size="small"
                                    sx={{
                                      backgroundColor: 'success.main',
                                      color: 'white',
                                      fontSize: '0.65rem',
                                      height: '18px',
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                              </Box>
                              {coupon.description && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  {coupon.description}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                  label={
                                    coupon.discountType === 'percentage'
                                      ? `${coupon.discountValue}% OFF`
                                      : `₹${coupon.discountValue} OFF`
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor: isEligible ? 'primary.main' : 'grey.400',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    height: '20px',
                                  }}
                                />
                                {coupon.minAmount > 0 && (
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      fontSize: '0.7rem',
                                    }}
                                  >
                                    Min ₹{coupon.minAmount}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.75rem' }}>
                    No coupons available
                  </Typography>
                )}

                {/* Manual Coupon Input */}
                {!appliedCoupon && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Or enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !validatingCoupon) {
                          handleApplyCoupon();
                        }
                      }}
                      disabled={validatingCoupon}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalOffer sx={{ fontSize: 16, color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon}
                      sx={{
                        minWidth: '70px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {validatingCoupon ? <CircularProgress size={14} /> : 'Apply'}
                    </Button>
                  </Box>
                )}

                {/* Applied Coupon Display */}
                {appliedCoupon && (
                  <Box
                    sx={{
                      p: 1,
                      mt: 1.5,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      border: '1px solid',
                      borderColor: 'success.main',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalOffer sx={{ fontSize: 16, color: 'success.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600, fontSize: '0.85rem' }}>
                          {appliedCoupon} Applied
                        </Typography>
                        {appliedCouponData && (
                          <Typography variant="caption" sx={{ color: 'success.main', fontSize: '0.7rem' }}>
                            {appliedCouponData.discountType === 'percentage'
                              ? `${appliedCouponData.discountValue}% off`
                              : `₹${appliedCouponData.discountValue} off`}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleRemoveCoupon}
                      sx={{
                        color: 'error.main',
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.08),
                        },
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                {/* Error/Success Messages */}
                {couponError && (
                  <Alert severity="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    {couponError}
                  </Alert>
                )}
                {couponSuccess && (
                  <Alert severity="success" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    {couponSuccess}
                  </Alert>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ marginBottom: 2 }}>
                {cartItems.map((item, index) => (
                  <Box
                    key={item._id || item.id || item.product?._id || item.product || `cart-item-${index}`}
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
                {couponDiscount > 0 && appliedCoupon && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Discount ({appliedCoupon}
                      {appliedCouponData && appliedCouponData.discountType === 'percentage'
                        ? ` - ${appliedCouponData.discountValue}%`
                        : ''}
                      )
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
                variant="contained"
                fullWidth
                size="large"
                disabled={orderLoading}
                onClick={handleSubmit}
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
