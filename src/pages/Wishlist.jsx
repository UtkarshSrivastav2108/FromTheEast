import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { FavoriteBorder, DeleteOutline, ShoppingCartOutlined } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { CircularProgress, Alert } from '@mui/material';

/**
 * Wishlist Page Component
 * Displays user's wishlist items with add to cart and remove functionality
 */
const Wishlist = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Extract wishlist items
  const wishlistItems = wishlist?.items || [];

  /**
   * Handle add to cart from wishlist
   * @param {Object} item - Wishlist item
   */
  const handleAddToCart = async (item) => {
    try {
      const productId = item.product?._id || item.product || item._id || item.id;
      await addToCart({ productId, quantity: 1 });
    } catch (err) {
      // Error handled in hook
    }
  };

  /**
   * Handle remove from wishlist
   * @param {string} itemId - Item ID
   */
  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(itemId);
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

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">{error.message}</Alert>
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
        <Container maxWidth="lg">
          <Box sx={{ padding: { xs: 1.25, sm: 2.5 }, py: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: 3.75,
              fontSize: { xs: '1.75rem', md: '2rem' },
            }}
          >
            MY WISHLIST
          </Typography>
          {wishlistItems.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {wishlistItems.map((item) => {
                const itemData = item.product || item;
                const itemId = item._id || item.id;
                return (
                  <Paper
                    key={itemId}
                    elevation={2}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 2.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '10px',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1.875, sm: 0 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2.5,
                        flex: { xs: 'none', sm: 2 },
                        width: { xs: '100%', sm: 'auto' },
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image || itemData?.image || ''}
                        alt={item.name || itemData?.name}
                        sx={{
                          width: { xs: '100%', sm: '150px' },
                          height: { xs: '200px', sm: '150px' },
                          objectFit: 'contain',
                          borderRadius: '10px',
                          backgroundColor: '#f5f5f5',
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: 1.25,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '20px' }}>
                          {item.name || itemData?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                          {item.description || itemData?.description || 'No description available'}
                        </Typography>
                        <Typography variant="h5" sx={{ fontSize: '24px', fontWeight: 300, color: 'primary.main' }}>
                          ₹{typeof item.price === 'number' ? item.price.toFixed(2) : (itemData?.price || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1.875,
                        alignItems: 'center',
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(item)}
                        sx={{
                          padding: '10px 20px',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          borderRadius: '5px',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DeleteOutline />}
                        onClick={() => handleRemove(itemId)}
                        sx={{
                          padding: '10px 20px',
                          border: '1px solid',
                          borderColor: 'error.main',
                          backgroundColor: 'white',
                          color: 'error.main',
                          borderRadius: '5px',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.08),
                            border: '1px solid',
                            borderColor: 'error.main',
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', padding: '60px 20px' }}>
              <Typography variant="h6" sx={{ fontSize: '18px', color: 'text.secondary', marginBottom: 2.5 }}>
                Your wishlist is empty
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/menu')}
                sx={{
                  padding: '10px 20px',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Start Shopping
              </Button>
            </Box>
          )}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Wishlist;
