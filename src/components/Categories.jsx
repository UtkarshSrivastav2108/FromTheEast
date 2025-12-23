import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { categories } from '../data';
import CategoryItem from './CategoryItem';

const Categories = () => {
  return (
    <Box
      sx={{
        padding: { xs: '48px 16px', md: '80px 24px' },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 700,
              marginBottom: 2,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Our Specials
          </Typography>
          <Box
            sx={{
              width: '80px',
              height: '4px',
              backgroundColor: 'primary.main',
              margin: '0 auto',
              borderRadius: '2px',
            }}
          />
          <Typography
            variant="body1"
            sx={{
              marginTop: 3,
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', md: '1rem' },
              maxWidth: '600px',
              margin: '24px auto 0',
            }}
          >
            Discover our signature dishes crafted with authentic recipes and premium ingredients
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {categories.map((item) => (
            <CategoryItem item={item} key={item.id} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Categories;
