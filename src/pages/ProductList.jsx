import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { menuCategories } from '../data';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useProducts';
import { Favorite, FavoriteBorder, ShoppingCartOutlined } from '@mui/icons-material';
import { IconButton, Button, Chip, CircularProgress, Alert } from '@mui/material';

/**
 * ProductList Page Component
 * Displays products dynamically based on category route param
 */
const ProductList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Fetch products from API
  const { products: allProducts, loading, error } = useProducts(
    category ? { category } : {}
  );
  
  const [sortBy, setSortBy] = useState('newest');
  const [filterVeg, setFilterVeg] = useState('all');

  // Get category info
  const categoryInfo = useMemo(() => {
    if (category) {
      return menuCategories.find((cat) => cat.id === category);
    }
    return null;
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by veg/non-veg
    if (filterVeg === 'veg') {
      filtered = filtered.filter((item) => item.isVeg);
    } else if (filterVeg === 'non-veg') {
      filtered = filtered.filter((item) => !item.isVeg);
    }

    // Sort products
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Keep original order (newest first)
      filtered = filtered.reverse();
    }

    return filtered;
  }, [allProducts, sortBy, filterVeg]);

  /**
   * Handle add to cart
   * @param {Object} item - Product item
   */
  const handleAddToCart = async (item) => {
    try {
      const productId = item._id || item.id;
      await addToCart({ productId, quantity: 1 });
    } catch (err) {
      // Error handled in hook
    }
  };

  /**
   * Handle wishlist toggle
   * @param {Object} item - Product item
   */
  const handleWishlistToggle = async (item) => {
    try {
      const itemId = item._id || item.id;
      if (isInWishlist(itemId)) {
        await removeFromWishlist(itemId);
      } else {
        await addToWishlist({ productId: itemId });
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
      <Navbar />
      <Announcement />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg">
        <Box sx={{ py: { xs: 2, md: 3 } }}>
          <Typography
            variant="h4"
            sx={{
              margin: { xs: 2, md: 2.5 },
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            {categoryInfo ? categoryInfo.name : 'All Products'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              marginBottom: 2,
              gap: 2,
              px: { xs: 2, md: 2.5 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { xs: 'stretch', sm: 'center' },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '16px', md: '18px' },
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Filter:
              </Typography>
              <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterVeg}
                  onChange={(e) => setFilterVeg(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="veg">Vegetarian</MenuItem>
                  <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '16px', md: '18px' },
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Sort:
              </Typography>
              <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                <InputLabel>Sort</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort"
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                  <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          {filteredProducts.length > 0 ? (
            <Grid container spacing={2} sx={{ px: { xs: 2, md: 2.5 } }}>
              {filteredProducts.map((item) => {
                const itemId = item._id || item.id;
                const isWishlisted = isInWishlist(itemId);
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={itemId}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 4,
                          transform: 'translateY(-4px)',
                        },
                      }}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {/* Product Image */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          paddingTop: '75%',
                          backgroundColor: '#f5f5f5',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                        {/* Badges */}
                        {item.badges && item.badges.length > 0 && (
                          <Chip
                            label={item.badges[0]}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              backgroundColor: 'primary.main',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        )}
                        {/* Veg/Non-Veg Indicator */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: '2px solid white',
                            backgroundColor: item.isVeg ? '#4caf50' : '#f44336',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.isVeg && (
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
                        {/* Wishlist Button */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWishlistToggle(item);
                          }}
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'white',
                            color: isWishlisted ? 'error.main' : 'text.secondary',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Box>
                      {/* Product Info */}
                      <Box sx={{ p: 1.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
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
                            mb: 1,
                            minHeight: '36px',
                          }}
                        >
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: 'primary.main',
                              fontSize: '1.1rem',
                            }}
                          >
                            ₹{item.price.toFixed(2)}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ShoppingCartOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            sx={{
                              borderRadius: 1.5,
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 1.5,
                            }}
                          >
                            Add
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                No products found
              </Typography>
              <Button variant="contained" onClick={() => navigate('/menu')}>
                Browse Menu
              </Button>
            </Box>
          )}
        </Box>
        </Container>
      </Box>
      <Newsletter />
      <Footer />
    </Box>
  );
};

export default ProductList;
