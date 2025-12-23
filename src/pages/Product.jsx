import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Remove, ArrowBack, Favorite, FavoriteBorder } from '@mui/icons-material';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../hooks/useWishlist';

/**
 * Product Detail Page Component
 * Displays individual product details dynamically based on route params
 */
const Product = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { cart, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  // Extract cart items
  const cartItems = cart?.items || [];

  // Get quantity in cart
  const cartQuantity = useMemo(() => {
    if (!product) return 0;
    const productId = product._id || product.id;
    const cartItem = cartItems.find((item) => {
      const itemProductId = item.product?._id?.toString() || item.product?.toString() || item.product?.id?.toString();
      return itemProductId === productId?.toString();
    });
    return cartItem ? cartItem.quantity : 0;
  }, [product, cartItems]);

  const isWishlisted = product ? isInWishlist(product._id || product.id) : false;

  /**
   * Handle quantity change
   * @param {number} delta - Change amount
   */
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  /**
   * Handle add to cart
   */
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const productId = product._id || product.id;
      await addToCart({ productId, quantity });
      setQuantity(1);
    } catch (err) {
      // Error handled in hook
    }
  };

  /**
   * Handle wishlist toggle
   */
  const handleWishlistToggle = async () => {
    if (!product) return;
    
    try {
      const productId = product._id || product.id;
      if (isWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({ productId });
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
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
        <Announcement />
        <Box sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {error ? error.message : 'Product not found'}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/menu')}>
              Back to Menu
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
      <Navbar />
      <Announcement />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg">
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 2,
              textTransform: 'none',
              color: 'text.secondary',
            }}
          >
            Back
          </Button>
          <Grid container spacing={3} sx={{ padding: { xs: 1.25, sm: 6.25 } }}>
            <Grid item xs={12} sm={6}>
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: { xs: '40vh', sm: '90vh' },
                  objectFit: 'contain',
                  borderRadius: 2,
                  backgroundColor: '#f5f5f5',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ padding: { xs: 1.25, sm: '0px 50px' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {product.badges && product.badges.length > 0 && (
                    <Chip
                      label={product.badges[0]}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: 'divider',
                      backgroundColor: product.isVeg ? '#4caf50' : '#f44336',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {product.isVeg && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'white',
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 600, marginBottom: 2 }}>
                  {product.name}
                </Typography>
                <Typography variant="body1" sx={{ margin: '20px 0px', color: 'text.secondary' }}>
                  {product.description}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    marginBottom: 2,
                    color: 'primary.main',
                  }}
                >
                  ₹{product.price.toFixed(2)}
                </Typography>
                <Box
                  sx={{
                    width: { xs: '100%', sm: '50%' },
                    margin: '30px 0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Remove />
                    </IconButton>
                    <Box
                      sx={{
                        minWidth: '40px',
                        textAlign: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {quantity}
                    </Box>
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <IconButton
                    onClick={handleWishlistToggle}
                    sx={{
                      color: isWishlisted ? 'error.main' : 'text.secondary',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    width: { xs: '100%', sm: '50%' },
                    display: 'flex',
                    gap: 2,
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    fullWidth
                    sx={{
                      padding: 1.875,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {cartQuantity > 0 ? `Add More (${cartQuantity} in cart)` : 'Add to Cart'}
                  </Button>
                </Box>
                {cartQuantity > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {cartQuantity} item(s) in cart
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate('/cart')}
                      sx={{ textTransform: 'none' }}
                    >
                      View Cart
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        </Container>
      </Box>
      <Newsletter />
      <Footer />
    </Box>
  );
};

export default Product;
