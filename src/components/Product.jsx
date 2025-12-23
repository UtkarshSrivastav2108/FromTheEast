import React, { useState } from 'react';
import { Box, IconButton, Typography, Chip, alpha } from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Product = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        backgroundColor: 'background.paper',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
          '& .product-image': {
            transform: 'scale(1.08)',
          },
          '& .product-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
        }}
      >
        <Box
          className="product-image"
          component="img"
          src={item.img}
          alt="product"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {/* Badge */}
        {item.id === 1 && (
          <Chip
            label="Popular"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
              zIndex: 2,
              height: '20px',
            }}
          />
        )}

        {/* Favorite Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: alpha('#fff', 0.9),
            color: isFavorite ? 'primary.main' : 'text.secondary',
            zIndex: 2,
            width: '32px',
            height: '32px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'scale(1.1)',
            },
          }}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>

        {/* Hover Actions */}
        <Box
          className="product-actions"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 1.5,
            backgroundColor: alpha('#000', 0.7),
            display: 'flex',
            justifyContent: 'center',
            gap: 0.75,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.3s ease',
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigate('/cart');
            }}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ShoppingCartOutlined />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${item.id}`);
            }}
            sx={{
              backgroundColor: 'white',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <SearchOutlined />
          </IconButton>
        </Box>
      </Box>

      {/* Product Info */}
      <Box sx={{ padding: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            marginBottom: 0.5,
            color: 'text.primary',
          }}
        >
          {item.name || `Dish ${item.id}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.8rem',
            marginBottom: 0.75,
          }}
        >
          {item.desc || 'Authentic Asian cuisine crafted with premium ingredients'}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            fontSize: '1rem',
          }}
        >
          ₹{item.price || (12.99 + item.id * 2).toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Product;
