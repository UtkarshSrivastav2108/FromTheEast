import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  Badge,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCartOutlined,
  Menu as MenuIcon,
  Logout,
  Person,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar Component
 * Main navigation bar with conditional rendering based on authentication
 */
const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Calculate cart item count from cart items
  const cartItemCount = useMemo(() => {
    if (!cart || !cart.items || !Array.isArray(cart.items)) return 0;
    return cart.items.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + quantity;
    }, 0);
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Get user name from user object
   */
  const userName = user
    ? user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null)
    : null;

  /**
   * Get user initials for avatar
   */
  const userInitials = user
    ? (user.firstName && user.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : user.name
        ? user.name.charAt(0).toUpperCase()
        : 'U')
    : 'U';

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    handleMenuClose();
    handleAvatarMenuClose();
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarMenuOpen = (event) => {
    setAvatarMenuAnchor(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleAvatarMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 4 : 0}
      sx={{
        height: { xs: '48px', sm: '56px' },
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: scrolled
          ? '0px 2px 8px rgba(0,0,0,0.08)'
          : 'none',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          padding: { xs: '0 10px', sm: '0 16px', md: '0 24px' },
          minHeight: { xs: '48px', sm: '56px' },
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Left Section - Search */}
        <Box
          sx={{
            flex: { xs: 0, md: 1 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 1,
          }}
        >
          {!isMobile && (
            <Box
              sx={{
                position: 'relative',
                borderRadius: '24px',
                backgroundColor: alpha(theme.palette.grey[100], 0.8),
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.grey[100], 1),
                },
                transition: 'all 0.2s ease',
                width: { md: '200px', lg: '280px' },
              }}
            >
              <Box
                sx={{
                  padding: '8px 16px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              </Box>
              <InputBase
                placeholder="Search dishes, cuisines..."
                sx={{
                  color: 'text.primary',
                  width: '100%',
                  padding: '8px 12px 8px 40px',
                  fontSize: '13px',
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      opacity: 0.6,
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Center - Logo and User Name */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 0,
            px: { xs: 1, sm: 2 },
            gap: 0.5,
            zIndex: 2,
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              width: '100%',
              display: 'block',
            }}
          >
            <Typography
              variant="h5"
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '22px' },
                letterSpacing: '-0.02em',
                color: 'primary.main',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                lineHeight: 1.2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  color: 'primary.dark',
                },
              }}
            >
              From The East
            </Typography>
          </Link>
          {userName && (
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '11px', sm: '12px', md: '13px' },
                fontWeight: 500,
                color: 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              {userName}
            </Typography>
          )}
        </Box>

        {/* Right Section - Actions */}
        <Box
          sx={{
            flex: { xs: 0, md: 1 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: { xs: 0.5, sm: 1, md: 2 },
            zIndex: 1,
          }}
        >
          {isMobile ? (
            <>
              <IconButton
                onClick={() => navigate('/cart')}
                sx={{
                  color: 'text.primary',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: 'text.primary',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                {isAuthenticated ? (
                  <>
                <MenuItem onClick={() => { navigate('/wishlist'); handleMenuClose(); }}>
                  Wishlist
                </MenuItem>
                <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                  Orders
                </MenuItem>
                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1, fontSize: 18 }} />
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }}>
                  Register
                </MenuItem>
                <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>
                  Sign In
                </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              {isAuthenticated && (
            <>
              <Link
                to="/wishlist"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  Wishlist
                </Typography>
              </Link>
              <Link
                to="/orders"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  Orders
                </Typography>
              </Link>
                </>
              )}
              {!isAuthenticated && (
                <>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  Register
                </Typography>
              </Link>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'primary.main',
                    cursor: 'pointer',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1.5px solid',
                    borderColor: 'primary.main',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  Sign In
                </Typography>
              </Link>
                </>
              )}
              <Link
                to="/cart"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <IconButton
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Badge badgeContent={cartItemCount} color="primary">
                    <ShoppingCartOutlined />
                  </Badge>
                </IconButton>
              </Link>
              {isAuthenticated && (
                <>
                  <IconButton
                    onClick={handleAvatarMenuOpen}
                    sx={{
                      padding: 0.5,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {userInitials}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={avatarMenuAnchor}
                    open={Boolean(avatarMenuAnchor)}
                    onClose={handleAvatarMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleProfileClick}>
                      <Person sx={{ mr: 1.5, fontSize: 20 }} />
                      Go to Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
