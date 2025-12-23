import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

const CartDrawer = ({ open, onClose, cart, onUpdateQuantity, totalPrice }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = totalPrice > 50 ? 0 : 5.9;
  const finalTotal = totalPrice + deliveryFee;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout', { state: { cart, totalPrice: finalTotal } });
  };

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '400px', md: '480px' },
          height: { xs: '85vh', sm: '100%' },
          borderTopLeftRadius: { xs: '24px', sm: 0 },
          borderTopRightRadius: { xs: '24px', sm: 0 },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            padding: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Your Cart ({totalItems})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: 2,
          }}
        >
          {cart.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
              }}
            >
              <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary' }} />
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Add items to get started
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cart.map((item) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    padding: 2,
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '12px',
                        objectFit: 'contain',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          marginBottom: 0.5,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          marginBottom: 1.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        {item.description}
                      </Typography>
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
                            color: 'primary.main',
                          }}
                        >
                          ₹{item.price}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: '24px',
                            padding: '4px 8px',
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            sx={{
                              color: 'primary.main',
                              padding: '4px',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                              },
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: 'primary.main',
                              minWidth: '24px',
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            sx={{
                              color: 'primary.main',
                              padding: '4px',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                              },
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer */}
        {cart.length > 0 && (
          <Box
            sx={{
              padding: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ marginBottom: 2 }}>
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
                  ₹{totalPrice.toFixed(2)}
                </Typography>
              </Box>
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
              <Divider sx={{ marginY: 1.5 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ₹{finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
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
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;

