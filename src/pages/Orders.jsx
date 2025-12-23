import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { Visibility, CheckCircle } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { useOrders } from '../hooks/useOrders';
import { CircularProgress, Alert } from '@mui/material';

/**
 * Orders Page Component
 * Displays user's order history dynamically
 */
const Orders = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { orders, loading, error } = useOrders();

  /**
   * Get status color for chip
   * @param {string} status - Order status
   * @returns {string} Color name
   */
  const getStatusColor = (status) => {
    const colors = {
      delivered: 'success',
      processing: 'warning',
      cancelled: 'error',
      pending: 'info',
    };
    return colors[status] || 'default';
  };

  /**
   * Get status label
   * @param {string} status - Order status
   * @returns {string} Formatted status label
   */
  const getStatusLabel = (status) => {
    const labels = {
      delivered: 'Delivered',
      processing: 'Processing',
      cancelled: 'Cancelled',
      pending: 'Pending',
    };
    return labels[status] || status;
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            MY ORDERS
          </Typography>
          {orders.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {orders.map((order) => (
                <Paper
                  key={order._id || order.id}
                  elevation={2}
                  sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '10px',
                    padding: 2.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 1.875,
                      paddingBottom: 1.875,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1.25, sm: 0 },
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.625 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                        Order #{order.orderNumber || order._id || order.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                        Placed on {formatDate(order.createdAt || order.date)}
                      </Typography>
                    </Box>
                    <Chip
                      icon={order.status === 'delivered' ? <CheckCircle /> : null}
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                      sx={{
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, marginBottom: 1.875 }}>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => {
                        const itemData = item.product || item;
                        return (
                          <Box key={item._id || item.id || index} sx={{ display: 'flex', gap: 1.875, alignItems: 'center' }}>
                            <Box
                              component="img"
                              src={item.image || itemData?.image || ''}
                              alt={item.name}
                              sx={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'contain',
                                borderRadius: '5px',
                                backgroundColor: '#f5f5f5',
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 500, marginBottom: 0.625 }}>
                                {item.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                                Quantity: {item.quantity || 1}
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                              ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </Typography>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No items in this order
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ marginY: 1.875 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1.875, sm: 0 },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: '20px', fontWeight: 600 }}>
                      Total: ₹{(order.total || 0).toFixed(2)}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => {
                        navigate(`/orders/${order._id || order.id}`);
                      }}
                      sx={{
                        padding: '10px 20px',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        backgroundColor: 'white',
                        color: 'primary.main',
                        borderRadius: '5px',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          border: '1px solid',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', padding: '60px 20px' }}>
              <Typography variant="h6" sx={{ fontSize: '18px', color: 'text.secondary', marginBottom: 2.5 }}>
                You haven't placed any orders yet
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

export default Orders;
