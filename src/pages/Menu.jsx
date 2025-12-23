import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Slider,
  FormControlLabel,
  Checkbox,
  Drawer,
  Divider,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCartOutlined,
  Favorite,
  FavoriteBorder,
  Search,
  FilterList,
  Close,
  Clear,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { menuCategories } from '../data';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useProducts';
import { CircularProgress, Alert } from '@mui/material';

/**
 * Menu Page Component
 * Main ordering experience with sticky categories and dish cards
 */
const Menu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { cart, addToCart, updateItem, removeItem, refetch } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { products: allProducts, loading: productsLoading, error: productsError } = useProducts();
  
  // Extract cart items from hook
  const cartItems = cart?.items || [];
  const [activeCategory, setActiveCategory] = useState('starters');
  const categoryRefs = useRef({});

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [vegFilter, setVegFilter] = useState('all'); // 'all', 'veg', 'nonveg'
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'name'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [priceRangeInitialized, setPriceRangeInitialized] = useState(false);

  // Process products from API - add categoryId and categoryName
  const allMenuItems = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return allProducts.map((item) => ({
      ...item,
      categoryId: item.category,
      categoryName: menuCategories.find(cat => cat.id === item.category)?.name || item.category,
      // Map MongoDB _id to id for compatibility
      id: item.id || item._id,
    }));
  }, [allProducts]);

  // Calculate min and max prices
  const priceRangeValues = useMemo(() => {
    if (allMenuItems.length === 0) return [0, 20];
    const prices = allMenuItems.map((item) => item.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [allMenuItems]);

  // Filter and sort menu items
  const filteredMenuItems = useMemo(() => {
    let filtered = [...allMenuItems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Veg/Non-veg filter
    if (vegFilter === 'veg') {
      filtered = filtered.filter((item) => item.isVeg === true);
    } else if (vegFilter === 'nonveg') {
      filtered = filtered.filter((item) => item.isVeg === false);
    }

    // Bestseller filter
    if (bestsellerOnly) {
      filtered = filtered.filter(
        (item) => item.badges && item.badges.includes('Bestseller')
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [allMenuItems, searchQuery, priceRange, vegFilter, bestsellerOnly, sortBy]);

  // Group filtered items by category
  const filteredItemsByCategory = useMemo(() => {
    const grouped = {};
    filteredMenuItems.forEach((item) => {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = [];
      }
      grouped[item.categoryId].push(item);
    });
    return grouped;
  }, [filteredMenuItems]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setPriceRange(priceRangeValues);
    setVegFilter('all');
    setBestsellerOnly(false);
    setSortBy('default');
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    priceRange[0] !== priceRangeValues[0] ||
    priceRange[1] !== priceRangeValues[1] ||
    vegFilter !== 'all' ||
    bestsellerOnly ||
    sortBy !== 'default';

  // Scroll to category when tab changes
  useEffect(() => {
    const element = categoryRefs.current[activeCategory];
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  }, [activeCategory, filteredMenuItems]);

  // Initialize price range
  useEffect(() => {
    if (!priceRangeInitialized && priceRangeValues[0] !== priceRangeValues[1] && allMenuItems.length > 0) {
      setPriceRange(priceRangeValues);
      setPriceRangeInitialized(true);
    }
  }, [priceRangeValues, priceRangeInitialized, allMenuItems.length]);

  // Handle scroll to update active category
  useEffect(() => {
    if (allMenuItems.length === 0) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let currentCategory = 'starters';

      menuCategories.forEach((category) => {
        const element = categoryRefs.current[category.id];
        if (element && element.offsetTop <= scrollPosition) {
          currentCategory = category.id;
        }
      });

      setActiveCategory(currentCategory);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredMenuItems, allMenuItems.length]);

  /**
   * Get quantity of item in cart
   * @param {number} itemId - Item ID
   * @returns {number} Quantity in cart
   */
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find((item) => {
      const productId = item.product?._id || item.product || item.id;
      return productId === itemId || item.id === itemId;
    });
    return cartItem ? cartItem.quantity : 0;
  };

  /**
   * Handle add to cart
   * @param {Object} item - Menu item
   */
  const handleAddToCart = async (item) => {
    try {
      // Menu items from data.js have numeric IDs, but we need to find the product in the database
      // For now, we'll use the item ID and let the backend handle it
      // If items are from API, use _id, otherwise use id
      const productId = item._id || item.id;
      await addToCart({ productId, quantity: 1 });
      await refetch(); // Refresh cart after adding
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Error handled in hook
    }
  };

  /**
   * Handle quantity change
   * @param {Object} item - Menu item
   * @param {number} delta - Change in quantity
   */
  const handleQuantityChange = async (item, delta) => {
    try {
      const currentQuantity = getItemQuantity(item.id);
      const newQuantity = currentQuantity + delta;
      
      if (newQuantity <= 0) {
        // Find the cart item ID to remove
        const cartItem = cartItems.find((cartItem) => {
          const productId = cartItem.product?._id || cartItem.product || cartItem.id;
          return productId === item.id || cartItem.id === item.id || String(productId) === String(item.id);
        });
        if (cartItem && removeItem) {
          await removeItem(cartItem._id || cartItem.id);
          await refetch();
          return;
        }
      }
      
      // Find the cart item to update
      const cartItem = cartItems.find((cartItem) => {
        const productId = cartItem.product?._id || cartItem.product || cartItem.id;
        return productId === item.id || cartItem.id === item.id || String(productId) === String(item.id);
      });
      
      if (cartItem) {
        await updateItem(cartItem._id || cartItem.id, newQuantity);
        await refetch(); // Refresh cart after updating
      } else if (delta > 0) {
        // Item not in cart, add it
        await handleAddToCart(item);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      // Error handled in hook
    }
  };

  if (productsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">{productsError.message}</Alert>
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
        <Container maxWidth="lg" sx={{ py: { xs: 1, md: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 1.5, md: 2 }, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.9rem' },
              mb: 0.5,
              color: 'text.primary',
            }}
          >
            Our Menu
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', md: '0.85rem' },
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover authentic Asian flavors crafted with passion
          </Typography>
        </Box>

        {/* Search and Filter Bar */}
        <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
          {/* Search Bar */}
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <TextField
              fullWidth
              placeholder="Search dishes, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', transition: 'color 0.2s ease' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{
                        color: 'text.secondary',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: 'text.primary',
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
              }}
            />
          </Box>

          {/* Filter Controls */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 1.5, md: 1.75 },
              alignItems: { xs: 'stretch', md: 'center' },
              flexWrap: 'wrap',
            }}
          >
            {/* Veg/Non-Veg Toggle */}
            <Box
              sx={{
                display: 'flex',
                gap: 0.75,
                backgroundColor: 'background.paper',
                borderRadius: 2.5,
                p: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Button
                variant={vegFilter === 'all' ? 'contained' : 'text'}
                onClick={() => setVegFilter('all')}
                sx={{
                  minWidth: { xs: '70px', sm: '90px' },
                  textTransform: 'none',
                  borderRadius: 2,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  fontWeight: vegFilter === 'all' ? 600 : 500,
                  px: { xs: 1.25, sm: 1.75 },
                  py: 0.875,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: vegFilter === 'all' ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: vegFilter === 'all' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                  },
                }}
              >
                All
              </Button>
              <Button
                variant={vegFilter === 'veg' ? 'contained' : 'text'}
                onClick={() => setVegFilter('veg')}
                sx={{
                  minWidth: { xs: '70px', sm: '90px' },
                  textTransform: 'none',
                  borderRadius: 2,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  fontWeight: vegFilter === 'veg' ? 600 : 500,
                  px: { xs: 1.25, sm: 1.75 },
                  py: 0.875,
                  color: vegFilter === 'veg' ? 'white' : '#4caf50',
                  backgroundColor: vegFilter === 'veg' ? '#4caf50' : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: vegFilter === 'veg' ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: vegFilter === 'veg' ? '0 2px 8px rgba(76, 175, 80, 0.3)' : 'none',
                  '&:hover': {
                    backgroundColor: vegFilter === 'veg' ? '#45a049' : alpha('#4caf50', 0.12),
                    transform: 'scale(1.05)',
                    boxShadow: vegFilter === 'veg' ? '0 2px 12px rgba(76, 175, 80, 0.4)' : '0 2px 8px rgba(76, 175, 80, 0.15)',
                  },
                }}
              >
                🥬 Veg
              </Button>
              <Button
                variant={vegFilter === 'nonveg' ? 'contained' : 'text'}
                onClick={() => setVegFilter('nonveg')}
                sx={{
                  minWidth: { xs: '70px', sm: '90px' },
                  textTransform: 'none',
                  borderRadius: 2,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  fontWeight: vegFilter === 'nonveg' ? 600 : 500,
                  px: { xs: 1.25, sm: 1.75 },
                  py: 0.875,
                  color: vegFilter === 'nonveg' ? 'white' : '#f44336',
                  backgroundColor: vegFilter === 'nonveg' ? '#f44336' : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: vegFilter === 'nonveg' ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: vegFilter === 'nonveg' ? '0 2px 8px rgba(244, 67, 54, 0.3)' : 'none',
                  '&:hover': {
                    backgroundColor: vegFilter === 'nonveg' ? '#d32f2f' : alpha('#f44336', 0.12),
                    transform: 'scale(1.05)',
                    boxShadow: vegFilter === 'nonveg' ? '0 2px 12px rgba(244, 67, 54, 0.4)' : '0 2px 8px rgba(244, 67, 54, 0.15)',
                  },
                }}
              >
                🍖 Non-Veg
              </Button>
            </Box>

            {/* Sort Dropdown */}
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: '100%', md: '200px' },
                backgroundColor: 'background.paper',
                borderRadius: 2.5,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
              }}
            >
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  fontWeight: 500,
                }}
              >
                <MenuItem value="default">Sort: Default</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="name">Name: A to Z</MenuItem>
              </Select>
            </FormControl>

            {/* Bestseller Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={bestsellerOnly}
                  onChange={(e) => setBestsellerOnly(e.target.checked)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    fontWeight: bestsellerOnly ? 600 : 500,
                    transition: 'font-weight 0.2s ease',
                    color: bestsellerOnly ? 'primary.main' : 'text.primary',
                  }}
                >
                  ⭐ Bestseller Only
                </Typography>
              }
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 2.5,
                px: 1.75,
                py: 0.75,
                border: '1px solid',
                borderColor: bestsellerOnly ? 'primary.main' : 'divider',
                m: 0,
                boxShadow: bestsellerOnly ? '0 2px 8px rgba(211, 47, 47, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  borderColor: bestsellerOnly ? 'primary.dark' : 'primary.main',
                },
              }}
            />

            {/* Price Range Display */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'background.paper',
                  borderRadius: 2.5,
                  px: 2,
                  py: 1.25,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.85rem',
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                >
                  💰 ₹{priceRange[0]} - ₹{priceRange[1]}
                </Typography>
              </Box>
            )}

            {/* Filter Button (Mobile) */}
            {isMobile && (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  borderColor: 'divider',
                  color: 'text.primary',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                More Filters
              </Button>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleResetFilters}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  borderColor: 'error.main',
                  color: 'error.main',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 1px 3px rgba(244, 67, 54, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'error.dark',
                    backgroundColor: alpha(theme.palette.error.main, 0.12),
                    boxShadow: '0 2px 8px rgba(244, 67, 54, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Clear Filters
              </Button>
            )}

            {/* Results Count */}
            <Box
              sx={{
                ml: { xs: 0, md: 'auto' },
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'background.paper',
                borderRadius: 2.5,
                px: 2,
                py: 1.25,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                {filteredMenuItems.length} item{filteredMenuItems.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
          </Box>

          {/* Price Range Slider (Desktop) */}
          {!isMobile && (
            <Box
              sx={{
                mt: 2,
                px: 2,
                py: 1.5,
                backgroundColor: 'background.paper',
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                }}
              >
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                min={priceRangeValues[0]}
                max={priceRangeValues[1]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value}`}
                sx={{
                  color: 'primary.main',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& .MuiSlider-thumb': {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                    },
                  },
                  '& .MuiSlider-track': {
                    transition: 'all 0.2s ease',
                  },
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: 'primary.main',
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 8px',
                  },
                }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: { xs: 0, md: 3 } }}>
          {/* Category Sidebar (Desktop) */}
          {!isMobile && (
            <Paper
              elevation={0}
              sx={{
                width: '180px',
                position: 'sticky',
                top: 72,
                height: 'fit-content',
                maxHeight: 'calc(100vh - 90px)',
                overflowY: 'auto',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                p: 0.5,
              }}
            >
              {menuCategories.map((category) => (
                <Button
                  key={category.id}
                  fullWidth
                  onClick={() => setActiveCategory(category.id)}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 1.25,
                    py: 0.75,
                    mb: 0.25,
                    borderRadius: 1,
                    textTransform: 'none',
                    color: activeCategory === category.id ? 'primary.main' : 'text.primary',
                    backgroundColor:
                      activeCategory === category.id
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                    fontWeight: activeCategory === category.id ? 600 : 400,
                    fontSize: '0.85rem',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Typography sx={{ mr: 0.5, fontSize: '0.9rem' }}>{category.icon}</Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.85rem' }}>{category.name}</Typography>
                </Button>
              ))}
            </Paper>
          )}

          {/* Category Tabs (Mobile) */}
          {isMobile && (
            <Box
              sx={{
                position: 'sticky',
                top: 64,
                zIndex: 10,
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                mb: 1.5,
              }}
            >
              <Tabs
                value={activeCategory}
                onChange={(e, newValue) => setActiveCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minWidth: 90,
                    fontSize: '0.8rem',
                    minHeight: 40,
                  },
                }}
              >
                {menuCategories.map((category) => (
                  <Tab
                    key={category.id}
                    label={category.name}
                    value={category.id}
                    icon={<Typography sx={{ fontSize: '1rem' }}>{category.icon}</Typography>}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>
          )}

          {/* Menu Items */}
          <Box sx={{ flex: 1 }}>
            {filteredMenuItems.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: { xs: 6, md: 10 },
                  px: 2,
                  animation: 'fadeIn 0.5s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(20px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.primary',
                    mb: 1.5,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: 600,
                  }}
                >
                  No items found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    maxWidth: '400px',
                    mx: 'auto',
                  }}
                >
                  Try adjusting your filters or search query to find what you're looking for
                </Typography>
                {hasActiveFilters && (
                  <Button
                    variant="contained"
                    onClick={handleResetFilters}
                    startIcon={<Clear />}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: 'none',
                      px: 3,
                      py: 1.25,
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                      },
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Box>
            ) : (
              menuCategories.map((category) => {
                const items = filteredItemsByCategory[category.id] || [];
                if (items.length === 0) return null;

                return (
                <Box
                  key={category.id}
                  ref={(el) => (categoryRefs.current[category.id] = el)}
                  sx={{ mb: { xs: 2.5, md: 3 } }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.15rem', md: '1.35rem' },
                      mb: 1.5,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      },
                      gap: { xs: 1.25, md: 1.25 },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {items.map((item) => {
                      const quantity = getItemQuantity(item.id);
                      const hasQuantity = quantity > 0;

                      return (
                        <Paper
                          key={item.id}
                          elevation={0}
                          sx={{
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            animation: 'fadeIn 0.4s ease-in-out',
                            '@keyframes fadeIn': {
                              '0%': {
                                opacity: 0,
                                transform: 'translateY(10px)',
                              },
                              '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                              },
                            },
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                              transform: 'translateY(-4px)',
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          {/* Dish Image */}
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              paddingTop: '45%',
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
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.4,
                              }}
                            >
                              {item.badges && item.badges.map((badge) => (
                                <Chip
                                  key={badge}
                                  label={badge}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.65rem',
                                    height: '18px',
                                    '& .MuiChip-label': {
                                      padding: '0 6px',
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                            {/* Veg/Non-Veg Indicator */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                width: 18,
                                height: 18,
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
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                  }}
                                />
                              )}
                            </Box>
                            {/* Wishlist Button */}
                            <IconButton
                              onClick={async (e) => {
                                e.stopPropagation();
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
                              }}
                              sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                backgroundColor: 'white',
                                color: isInWishlist(item._id || item.id) ? 'error.main' : 'text.secondary',
                                width: '28px',
                                height: '28px',
                                '& svg': {
                                  fontSize: '1rem',
                                },
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              {isInWishlist(item._id || item.id) ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                          </Box>

                          {/* Dish Info */}
                          <Box sx={{ p: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                mb: 0.4,
                                color: 'text.primary',
                                lineHeight: 1.3,
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.7rem',
                                mb: 0.6,
                                minHeight: '28px',
                                lineHeight: 1.3,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {item.description}
                            </Typography>

                            {/* Price and Add Button */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  fontSize: '0.9rem',
                                }}
                              >
                                ₹{item.price.toFixed(2)}
                              </Typography>

                              {!hasQuantity ? (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleAddToCart(item)}
                                  startIcon={<Add />}
                                  sx={{
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 1.25,
                                    py: 0.5,
                                    fontSize: '0.75rem',
                                    minWidth: 'auto',
                                  }}
                                >
                                  Add
                                </Button>
                              ) : (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    border: '1px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: 1.5,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item, -1)}
                                    sx={{
                                      color: 'primary.main',
                                      padding: '4px',
                                      '& svg': {
                                        fontSize: '0.9rem',
                                      },
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      },
                                    }}
                                  >
                                    <Remove fontSize="small" />
                                  </IconButton>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 600,
                                      minWidth: '20px',
                                      textAlign: 'center',
                                      fontSize: '0.85rem',
                                    }}
                                  >
                                    {quantity}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleQuantityChange(item, 1)}
                                    sx={{
                                      color: 'primary.main',
                                      padding: '4px',
                                      '& svg': {
                                        fontSize: '0.9rem',
                                      },
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      },
                                    }}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                </Box>
              );
            })
            )}
          </Box>
        </Box>
      </Container>

      {/* Filter Drawer (Mobile) */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '85%', sm: '400px' },
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
            Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Price Range */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, fontSize: '0.95rem' }}>
            Price Range
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontSize: '0.85rem' }}>
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </Typography>
          <Slider
            value={priceRange}
            onChange={(e, newValue) => setPriceRange(newValue)}
            min={priceRangeValues[0]}
            max={priceRangeValues[1]}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value}`}
            sx={{
              color: 'primary.main',
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Veg/Non-Veg Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, fontSize: '0.95rem' }}>
            Food Type
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant={vegFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setVegFilter('all')}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.25,
              }}
            >
              All Items
            </Button>
            <Button
              fullWidth
              variant={vegFilter === 'veg' ? 'contained' : 'outlined'}
              onClick={() => setVegFilter('veg')}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.25,
                borderColor: '#4caf50',
                backgroundColor: vegFilter === 'veg' ? '#4caf50' : 'transparent',
                color: vegFilter === 'veg' ? 'white' : '#4caf50',
                '&:hover': {
                  backgroundColor: vegFilter === 'veg' ? '#45a049' : alpha('#4caf50', 0.1),
                },
              }}
            >
              🥬 Vegetarian Only
            </Button>
            <Button
              fullWidth
              variant={vegFilter === 'nonveg' ? 'contained' : 'outlined'}
              onClick={() => setVegFilter('nonveg')}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.25,
                borderColor: '#f44336',
                backgroundColor: vegFilter === 'nonveg' ? '#f44336' : 'transparent',
                color: vegFilter === 'nonveg' ? 'white' : '#f44336',
                '&:hover': {
                  backgroundColor: vegFilter === 'nonveg' ? '#d32f2f' : alpha('#f44336', 0.1),
                },
              }}
            >
              🍖 Non-Vegetarian Only
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Bestseller Filter */}
        <Box sx={{ mb: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={bestsellerOnly}
                onChange={(e) => setBestsellerOnly(e.target.checked)}
              />
            }
            label={
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Bestseller Only
              </Typography>
            }
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Sort */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, fontSize: '0.95rem' }}>
            Sort By
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="name">Name: A to Z</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            {filteredMenuItems.length} item{filteredMenuItems.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleResetFilters}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              py: 1.25,
            }}
          >
            Reset
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setFilterDrawerOpen(false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              py: 1.25,
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Floating Cart Button (Mobile) */}
      {isMobile && cartItems.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1.5,
            borderRadius: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
            zIndex: 1000,
            backgroundColor: 'background.paper',
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/cart')}
            startIcon={<ShoppingCartOutlined />}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              fontSize: '0.85rem',
            }}
          >
            View Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items) • ₹
            {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
          </Button>
        </Paper>
      )}
      </Box>
      <Footer />
    </Box>
  );
};

export default Menu;
