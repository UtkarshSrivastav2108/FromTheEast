import React from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import Product from './Product';
import { useProducts } from '../hooks/useProducts';

const Products = () => {
  const { products, loading } = useProducts({ featured: true });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use featured products as popular products
  const popularProducts = products || [];

  if (popularProducts.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: { xs: '32px 16px', md: '48px 24px' },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: { xs: 3, md: 4 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              marginBottom: 1.5,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Popular Dishes
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
              marginTop: 2,
              color: 'text.secondary',
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              maxWidth: '600px',
              margin: '20px auto 0',
            }}
          >
            Our most loved dishes, handpicked by our chefs
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {popularProducts.map((item) => (
            <Product item={item} key={item._id || item.id} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Products;
