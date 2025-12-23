import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { Add, Remove, DeleteOutline, ArrowBack, ShoppingCartOutlined, LocalOffer } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { CircularProgress } from '@mui/material';

/**
 * Available coupon codes
 */
const COUPONS = {
  WELCOME10: { discount: 10, type: 'percentage', minAmount: 0 },
  SAVE20: { discount: 20, type: 'percentage', minAmount: 30 },
  FLAT5: { discount: 5, type: 'fixed', minAmount: 15 },
  EAST15: { discount: 15, type: 'percentage', minAmount: 25 },
};

/**
 * Cart Page Component
 * Modern cart experience with slide-in design and coupon support
 */
const Cart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { cart, loading, error, updateItem, removeItem, clearCart, refetch } = useCart();
  
  // Extract cart items and normalize data structure
  // Handle both populated product and direct item data
  const rawItems = cart?.items || [];
  const cartItems = rawItems.map(item => {
    const product = item.product || {};
    return {
      _id: item._id,
      id: item._id || item.id,
      name: item.name || product.name || 'Unknown Item',
      description: item.description || product.description || '',
      price: item.price || product.price || 0,
      quantity: item.quantity || 1,
      image: item.image || product.image || '',
      product: product,
    };
  });
  
  // Debug: Log cart data
  useEffect(() => {
    if (cart) {
      console.log('Cart data:', cart);
      console.log('Raw items:', rawItems);
      console.log('Cart items:', cartItems);
    }
    if (error) {
      console.error('Cart error:', error);
    }
  }, [cart, cartItems, error, rawItems]);
  
  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = getTotal();
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  
  // Calculate coupon discount
  let discount = 0;
  if (appliedCoupon) {
    const coupon = COUPONS[appliedCoupon];
    if (subtotal >= coupon.minAmount) {
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.discount) / 100;
      } else {
        discount = coupon.discount;
      }
    }
  }
  
  const total = subtotal + deliveryFee - discount;

  /**
   * Handle update quantity
   * @param {string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await updateItem(itemId, quantity);
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  /**
   * Handle remove item
   * @param {string} itemId - Cart item ID
   */
  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  /**
   * Apply coupon code
   */
  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const code = couponCode.trim().toUpperCase();
    const coupon = COUPONS[code];

    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (subtotal < coupon.minAmount) {
      setCouponError(`Minimum order of ₹${coupon.minAmount} required for this coupon`);
      return;
    }

    setAppliedCoupon(code);
    setCouponSuccess(`Coupon "${code}" applied successfully!`);
    setCouponCode('');
  };

  /**
   * Remove applied coupon
   */
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  };

  // Only show empty cart if not loading and cart exists but has no items
  if (!loading && cart && cartItems.length === 0) {
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
        <Navbar />
        <Box sx={{ flex: 1 }}>
          <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 8, md: 12 },
            }}
          >
            <ShoppingCartOutlined
              sx={{
                fontSize: { xs: 80, md: 120 },
                color: 'text.secondary',
                mb: 3,
                opacity: 0.3,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Your cart is empty
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              Looks like you haven't added anything to your cart yet. Start exploring our menu!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/menu')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Browse Menu
            </Button>
          </Box>
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
      <Navbar />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 1.5, md: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 2, md: 3 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                color: 'text.primary',
              }}
            >
              Your Cart
            </Typography>
          </Box>
          {cartItems.length > 0 && (
            <Button
              variant="text"
              onClick={async () => {
                try {
                  await clearCart();
                } catch (err) {
                  // Error handled in hook
                }
              }}
              sx={{
                color: 'error.main',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {/* Cart Items */}
          <Box sx={{ flex: { md: 2 } }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              {cartItems.map((item, index) => (
                <Box key={item._id || item.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      p: { xs: 1.5, md: 2 },
                    }}
                  >
                    {/* Item Image */}
                    <Box
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image || item.product?.image}
                        alt={item.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>

                    {/* Item Details */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: '0.95rem', md: '1rem' },
                              mb: 0.5,
                              color: 'text.primary',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.8rem',
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(item._id || item.id)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.08),
                            },
                          }}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Price and Quantity Controls */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 'auto',
                        }}
                      >
                        <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: 'text.primary',
                              fontSize: { xs: '1rem', md: '1.1rem' },
                            }}
                        >
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item._id || item.id, item.quantity - 1)}
                            sx={{
                              color: 'text.primary',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              },
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              minWidth: '32px',
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item._id || item.id, item.quantity + 1)}
                            sx={{
                              color: 'text.primary',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              },
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
          </Box>

          {/* Order Summary */}
          <Box sx={{ flex: { md: 1 }, position: { md: 'sticky' }, top: { md: 100 }, height: 'fit-content' }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                p: { xs: 1.5, md: 2 },
                position: 'sticky',
                top: { md: 100 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                Order Summary
              </Typography>

              {/* Coupon Section */}
              <Box sx={{ mb: 2 }}>
                {!appliedCoupon ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCoupon();
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalOffer sx={{ fontSize: 18, color: 'text.secondary' }} />
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
                      sx={{
                        minWidth: '80px',
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
                      Apply
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 1.5,
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
                      <LocalOffer sx={{ fontSize: 18, color: 'success.main' }} />
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                        {appliedCoupon} Applied
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleRemoveCoupon}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.08),
                        },
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                )}
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ₹{subtotal.toFixed(2)}
                  </Typography>
                </Box>
                {discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      Discount ({appliedCoupon})
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                      -₹{discount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Delivery Fee
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {deliveryFee === 0 ? (
                      <Typography component="span" sx={{ color: 'success.main' }}>
                        Free
                      </Typography>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </Typography>
                </Box>
                {subtotal < 50 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Add ₹{(50 - subtotal).toFixed(2)} more for free delivery
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  navigate('/checkout', {
                    state: {
                      appliedCoupon,
                      discount,
                    },
                  });
                }}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 16px rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 24px rgba(211, 47, 47, 0.4)',
                  },
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="text"
                fullWidth
                size="medium"
                onClick={() => navigate('/menu')}
                sx={{
                  mt: 1.5,
                  textTransform: 'none',
                  color: 'text.secondary',
                }}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Box>
        </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Cart;
