import React from 'react';
import { Box, Button, Typography, alpha } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategoryItem = ({ item }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '280px', sm: '400px', md: '500px' },
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          '& .category-image': {
            transform: 'scale(1.1)',
          },
          '& .category-overlay': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
    >
      <Box
        className="category-image"
        component="img"
        src={item.img}
        alt={item.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <Box
        className="category-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 4,
          transition: 'background-color 0.4s ease',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            marginBottom: 2,
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '2rem' },
            textAlign: 'center',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          {item.title}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{
            padding: '12px 32px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '24px',
            backgroundColor: 'white',
            color: 'primary.main',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
            },
          }}
        >
          Explore Menu
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryItem;
