import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import { useOrder } from '../hooks/useOrders';

/**
 * Order Detail Page Component
 * Displays detailed information about a specific order
 */
const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { order, loading, error } = useOrder(id);

  /**
   * Get status color for chip
   * @param {string} status - Order status
   * @returns {string} Color name
   */
  const getStatusColor = (status) => {
    const colors = {
      delivered: 'success',
      processing: 'warning',
      preparing: 'warning',
      ready: 'info',
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
      preparing: 'Preparing',
      ready: 'Ready',
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Format payment method
   * @param {string} method - Payment method
   * @returns {string} Formatted payment method
   */
  const formatPaymentMethod = (method) => {
    const methods = {
      card: 'Credit/Debit Card',
      cash: 'Cash',
      paypal: 'PayPal',
      cod: 'Cash on Delivery',
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Announcement />
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Announcement />
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '50vh', px: 2 }}>
          <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
            {error.message || 'Failed to load order details'}
          </Alert>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Announcement />
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '50vh', px: 2 }}>
          <Alert severity="info" sx={{ maxWidth: 600, width: '100%' }}>
            Order not found
          </Alert>
        </Box>
        <Footer />
      </Box>
    );
  }

  // Handle both response formats: { data: order } or direct order object
  const orderData = order.data || order;

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
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/orders')}
              sx={{
                marginBottom: 2.5,
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Back to Orders
            </Button>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                marginBottom: 3.75,
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              ORDER DETAILS
            </Typography>

            <Paper
              elevation={2}
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '10px',
                padding: { xs: 2, sm: 3 },
                marginBottom: 2.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 2.5,
                  paddingBottom: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1.25, sm: 0 },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.625 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '18px', sm: '20px' } }}>
                    Order #{orderData.orderNumber || orderData._id || orderData.id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                    Placed on {formatDate(orderData.createdAt || orderData.date)}
                  </Typography>
                </Box>
                <Chip
                  icon={orderData.status === 'delivered' ? <CheckCircle /> : null}
                  label={getStatusLabel(orderData.status)}
                  color={getStatusColor(orderData.status)}
                  sx={{
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                />
              </Box>

              <Divider sx={{ marginY: 2.5 }} />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  marginBottom: 2,
                  fontSize: { xs: '16px', sm: '18px' },
                }}
              >
                Order Items
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2.5 }}>
                {orderData.items && orderData.items.length > 0 ? (
                  orderData.items.map((item, index) => {
                    const itemData = item.product || item;
                    const productImage = item.image || itemData?.image || '';
                    const productName = item.name || itemData?.name || 'Unknown Product';
                    const productPrice = item.price || itemData?.price || 0;
                    const quantity = item.quantity || 1;

                    return (
                      <Box
                        key={item._id || item.id || index}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          alignItems: 'center',
                          padding: 2,
                          backgroundColor: 'background.default',
                          borderRadius: '8px',
                        }}
                      >
                        <Box
                          component="img"
                          src={productImage}
                          alt={productName}
                          sx={{
                            width: { xs: '60px', sm: '100px' },
                            height: { xs: '60px', sm: '100px' },
                            objectFit: 'contain',
                            borderRadius: '5px',
                            backgroundColor: '#f5f5f5',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, marginBottom: 0.625 }}>
                            {productName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                            Quantity: {quantity}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
                            Price: ₹{productPrice.toFixed(2)} each
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '16px', sm: '18px' } }}>
                          ₹{(productPrice * quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                    No items in this order
                  </Typography>
                )}
              </Box>

              <Divider sx={{ marginY: 2.5 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 1.5,
                      fontSize: { xs: '16px', sm: '18px' },
                    }}
                  >
                    Delivery Address
                  </Typography>
                  {orderData.address ? (
                    <Box sx={{ color: 'text.secondary', fontSize: '14px', lineHeight: 1.8 }}>
                      <Typography variant="body2">
                        {orderData.address.firstName} {orderData.address.lastName}
                      </Typography>
                      <Typography variant="body2">{orderData.address.street}</Typography>
                      <Typography variant="body2">
                        {orderData.address.city}, {orderData.address.zipCode}
                      </Typography>
                      <Typography variant="body2">{orderData.address.country}</Typography>
                      <Typography variant="body2" sx={{ marginTop: 1 }}>
                        Phone: {orderData.address.phone}
                      </Typography>
                      <Typography variant="body2">Email: {orderData.address.email}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No address information available
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 1.5,
                      fontSize: { xs: '16px', sm: '18px' },
                    }}
                  >
                    Payment Information
                  </Typography>
                  <Box sx={{ color: 'text.secondary', fontSize: '14px', lineHeight: 1.8 }}>
                    <Typography variant="body2">
                      Payment Method: {formatPaymentMethod(orderData.paymentMethod || 'card')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ marginY: 2.5 }} />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  padding: 2,
                  backgroundColor: 'background.default',
                  borderRadius: '8px',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Subtotal:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ₹{(orderData.subtotal || 0).toFixed(2)}
                  </Typography>
                </Box>
                {orderData.deliveryFee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      Delivery Fee:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      ₹{(orderData.deliveryFee || 0).toFixed(2)}
                    </Typography>
                  </Box>
                )}
                {orderData.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      Discount:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                      -₹{(orderData.discount || 0).toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '18px', sm: '20px' } }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '18px', sm: '20px' } }}>
                    ₹{(orderData.total || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default OrderDetail;

