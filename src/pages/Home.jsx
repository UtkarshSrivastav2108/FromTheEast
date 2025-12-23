import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { ArrowForward, ShoppingCartOutlined, Add, Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useProducts';
import { CircularProgress, Alert } from '@mui/material';

/**
 * Home Page Component
 * Brand introduction with hero section and featured dishes
 */
const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { products: featuredProducts, loading: productsLoading, error: productsError } = useProducts({ featured: true });
  
  // Use API products
  const displayProducts = featuredProducts || [];

  /**
   * Handle add to cart from featured dishes
   * @param {Object} dish - Dish item
   * @param {Event} e - Click event
   */
  const handleAddToCart = async (dish, e) => {
    e.stopPropagation(); // Prevent card click navigation
    try {
      const productId = dish._id || dish.id;
      await addToCart({ productId, quantity: 1 });
    } catch (err) {
      // Error handled in hook
    }
  };

  /**
   * Get quantity of item in cart
   * @param {string} itemId - Item ID
   * @returns {number} Quantity in cart
   */
  const getItemQuantity = (itemId) => {
    if (!itemId) return 0;
    const cartItems = cart?.items || [];
    const searchId = itemId.toString();
    const cartItem = cartItems.find((item) => {
      const itemProductId = item.product?._id?.toString() || item.product?.toString() || item.product?.id?.toString();
      return itemProductId === searchId;
    });
    return cartItem ? cartItem.quantity : 0;
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
      <Announcement />
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', sm: '70vh', md: '85vh' },
          minHeight: { xs: '400px', sm: '500px', md: '600px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Animated Background Gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #0f0a0a 0%, #1a1414 25%, #0f0a0a 50%, #0a0505 75%, #0f0a0a 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
            zIndex: 0,
            '@keyframes gradientShift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        />

        {/* Background Image with Parallax Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            right: '-10%',
            bottom: '-10%',
            backgroundImage:
              'url(https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            zIndex: 1,
            transform: 'scale(1.1)',
            filter: 'blur(1px)',
            transition: 'transform 0.3s ease-out',
            '&:hover': {
              transform: 'scale(1.15)',
            },
          }}
        />

        {/* Japanese Raymond Cart Images - Aesthetic Decorative Elements */}
        {/* Left Side Cart */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
          alt="Japanese food cart"
          sx={{
            position: 'absolute',
            left: { xs: '-15%', md: '5%' },
            bottom: { xs: '10%', md: '15%' },
            width: { xs: '200px', sm: '280px', md: '350px', lg: '400px' },
            height: 'auto',
            opacity: 0.4,
            zIndex: 1,
            filter: 'blur(0.5px)',
            transform: 'rotate(-5deg)',
            transition: 'all 0.5s ease',
            objectFit: 'contain',
            '@keyframes floatCart': {
              '0%, 100%': { transform: 'rotate(-5deg) translateY(0px)' },
              '50%': { transform: 'rotate(-3deg) translateY(-15px)' },
            },
            animation: 'floatCart 8s ease-in-out infinite',
          }}
        />

        {/* Right Side Cart */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
          alt="Japanese street food cart"
          sx={{
            position: 'absolute',
            right: { xs: '-15%', md: '5%' },
            bottom: { xs: '15%', md: '20%' },
            width: { xs: '180px', sm: '250px', md: '320px', lg: '380px' },
            height: 'auto',
            opacity: 0.35,
            zIndex: 1,
            filter: 'blur(0.5px)',
            transform: 'rotate(5deg)',
            transition: 'all 0.5s ease',
            objectFit: 'contain',
            '@keyframes floatCartRight': {
              '0%, 100%': { transform: 'rotate(5deg) translateY(0px)' },
              '50%': { transform: 'rotate(7deg) translateY(-20px)' },
            },
            animation: 'floatCartRight 10s ease-in-out infinite',
          }}
        />

        {/* Center Background Cart (Subtle) */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80"
          alt="Japanese ramen cart"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '250px', sm: '350px', md: '450px' },
            height: 'auto',
            opacity: 0.15,
            zIndex: 1,
            filter: 'blur(2px)',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />

        {/* Additional Decorative Cart - Top Left */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
          alt="Japanese food vendor cart"
          sx={{
            position: 'absolute',
            left: { xs: '-10%', md: '2%' },
            top: { xs: '15%', md: '20%' },
            width: { xs: '150px', sm: '200px', md: '250px' },
            height: 'auto',
            opacity: 0.25,
            zIndex: 1,
            filter: 'blur(1px)',
            transform: 'rotate(-8deg)',
            objectFit: 'contain',
            '@keyframes floatCartTop': {
              '0%, 100%': { transform: 'rotate(-8deg) translateX(0px)' },
              '50%': { transform: 'rotate(-6deg) translateX(10px)' },
            },
            animation: 'floatCartTop 12s ease-in-out infinite',
          }}
        />

        {/* Dynamic Overlay with Gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.45) 100%)',
            zIndex: 2,
          }}
        />

        {/* Floating Particles Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            opacity: 0.3,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(211,47,47,0.3) 0%, transparent 70%)',
              top: '20%',
              left: '10%',
              animation: 'float 6s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,111,0,0.2) 0%, transparent 70%)',
              bottom: '15%',
              right: '15%',
              animation: 'float 8s ease-in-out infinite reverse',
            },
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) scale(1)' },
              '50%': { transform: 'translateY(-30px) scale(1.1)' },
            },
          }}
        />

        {/* Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <Box
            sx={{
              animation: 'fadeInUp 1s ease-out',
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                mb: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #ffebee 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(211, 47, 47, 0.3)',
                letterSpacing: { xs: '-0.02em', md: '-0.03em' },
                lineHeight: 1.1,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, #d32f2f, transparent)',
                  borderRadius: '2px',
                },
              }}
            >
              From The East
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                color: 'rgba(255,255,255,0.95)',
                mb: 1.5,
                letterSpacing: { xs: '0.05em', md: '0.1em' },
                textTransform: 'uppercase',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              Authentic Asian Cuisine
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                color: 'rgba(255,255,255,0.85)',
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.8,
                textShadow: '0 2px 15px rgba(0,0,0,0.4)',
                fontWeight: 300,
              }}
            >
              Experience the rich flavors and traditions of Asia, crafted with passion and
              authenticity. Every dish tells a story.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/menu')}
                endIcon={<ArrowForward />}
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.25, md: 1.5 },
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #d32f2f 0%, #ff6f00 100%)',
                  boxShadow: '0 8px 30px rgba(211, 47, 47, 0.5), 0 0 0 0 rgba(211, 47, 47, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(211, 47, 47, 0.6), 0 0 0 8px rgba(211, 47, 47, 0.1)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-1px) scale(0.98)',
                  },
                }}
              >
                View Menu
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/reservation')}
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.25, md: 1.5 },
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  borderWidth: 2.5,
                  borderColor: 'rgba(255,255,255,0.9)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: alpha('#fff', 0.1),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderWidth: 2.5,
                    borderColor: 'white',
                    backgroundColor: alpha('#fff', 0.2),
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                  },
                }}
              >
                Book a Table
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Our Specials Section */}
      <Box
        sx={{
          py: { xs: 3, md: 4 },
          backgroundColor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
            <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.9rem' },
              mb: 1,
              color: 'text.primary',
            }}
            >
              Our Specials
            </Typography>
            <Box
              sx={{
                width: '60px',
                height: '3px',
                backgroundColor: 'primary.main',
                margin: '0 auto',
                borderRadius: '2px',
              }}
            />
            <Typography
            variant="body1"
            sx={{
              mt: 1.5,
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', md: '0.85rem' },
              maxWidth: '600px',
              mx: 'auto',
            }}
            >
              Handpicked favorites that showcase the best of our culinary expertise
            </Typography>
          </Box>

          <Grid container spacing={1.5}>
            {displayProducts.map((dish) => {
              const dishId = dish._id || dish.id;
              return (
                <Grid item xs={12} sm={6} md={3} key={dishId}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-8px)',
                      },
                    }}
                    onClick={() => navigate(`/product/${dishId}`)}
                  >
                  {/* Dish Image */}
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
                      src={dish.image}
                      alt={dish.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.6s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    />
                    {dish.badges && dish.badges.length > 0 && (
                      <Chip
                        label={dish.badges[0]}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          zIndex: 2,
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        zIndex: 2,
                      }}
                    >
                      <IconButton
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const checkId = dish._id || dish.id;
                            if (isInWishlist(checkId)) {
                              await removeFromWishlist(checkId);
                            } else {
                              await addToWishlist({ productId: checkId });
                            }
                          } catch (err) {
                            // Error handled in hook
                          }
                        }}
                        sx={{
                          backgroundColor: alpha('#fff', 0.9),
                          color: isInWishlist(dishId) ? 'primary.main' : 'text.secondary',
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            backgroundColor: 'white',
                            transform: 'scale(1.1)',
                            color: 'primary.main',
                          },
                        }}
                      >
                        {isInWishlist(dishId) ? (
                          <Favorite sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        ) : (
                          <FavoriteBorder sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        )}
                      </IconButton>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: '2px solid white',
                          backgroundColor: dish.isVeg ? '#4caf50' : '#f44336',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'flex-end',
                        }}
                      >
                        {dish.isVeg && (
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
                  </Box>

                  {/* Dish Info */}
                  <Box sx={{ p: 1.25, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        mb: 0.5,
                        color: 'text.primary',
                      }}
                    >
                      {dish.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        mb: 0.75,
                        flex: 1,
                      }}
                    >
                      {dish.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          fontSize: '1rem',
                        }}
                      >
                        ₹{dish.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={getItemQuantity(dishId) > 0 ? <ShoppingCartOutlined /> : <Add />}
                        onClick={(e) => handleAddToCart(dish, e)}
                        sx={{
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          px: 1.5,
                          py: 0.5,
                          minWidth: 'auto',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: 2,
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {getItemQuantity(dishId) > 0 ? `${getItemQuantity(dishId)} in cart` : 'Add'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
            })}
          </Grid>

          {/* CTA Section */}
          <Box sx={{ textAlign: 'center', mt: { xs: 2, md: 3 } }}>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => navigate('/menu')}
              endIcon={<ArrowForward />}
              sx={{
                px: 2.5,
                py: 0.75,
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              View Full Menu
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
