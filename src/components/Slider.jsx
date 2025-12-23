import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Container, alpha, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSliders } from '../hooks/useSliders';

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { sliders, loading } = useSliders();

  useEffect(() => {
    if (sliders.length > 0) {
      const timer = setInterval(() => {
        setSlideIndex((prev) => (prev < sliders.length - 1 ? prev + 1 : 0));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [sliders]);

  const handleClick = (direction) => {
    if (sliders.length === 0) return;
    if (direction === 'left') {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : sliders.length - 1);
    } else {
      setSlideIndex(slideIndex < sliders.length - 1 ? slideIndex + 1 : 0);
    }
  };

  if (isMobile) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (sliders.length === 0) {
    return null;
  }

  const currentSlide = sliders[slideIndex];

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: '60vh', md: '85vh' },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Background Image with Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${currentSlide.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateX(${slideIndex * -100}%)`,
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)',
          },
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '600px' },
            color: 'white',
            animation: 'fadeInUp 0.8s ease-out',
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
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              fontWeight: 700,
              marginBottom: 3,
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            {currentSlide.title || 'Authentic Asian Cuisine'}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
              marginBottom: 4,
              lineHeight: 1.6,
              color: alpha(theme.palette.common.white, 0.95),
              textShadow: '0 1px 10px rgba(0,0,0,0.2)',
            }}
          >
            {currentSlide.description || 'Experience the rich flavors of Central, East, South, and Southeast Asia.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '12px',
                backgroundColor: 'primary.main',
                color: 'white',
                boxShadow: '0 4px 16px rgba(211, 47, 47, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 24px rgba(211, 47, 47, 0.5)',
                },
              }}
            >
              Explore Menu
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '12px',
                borderColor: 'white',
                color: 'white',
                borderWidth: '2px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Reserve a Table
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Navigation Arrows */}
      <IconButton
        onClick={() => handleClick('left')}
        sx={{
          position: 'absolute',
          left: { xs: '16px', md: '32px' },
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          backgroundColor: alpha(theme.palette.common.white, 0.9),
          color: 'text.primary',
          borderRadius: '50%',
          zIndex: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'white',
            transform: 'translateY(-50%) scale(1.1)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          },
        }}
      >
        <ArrowLeft />
      </IconButton>
      <IconButton
        onClick={() => handleClick('right')}
        sx={{
          position: 'absolute',
          right: { xs: '16px', md: '32px' },
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          backgroundColor: alpha(theme.palette.common.white, 0.9),
          color: 'text.primary',
          borderRadius: '50%',
          zIndex: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'white',
            transform: 'translateY(-50%) scale(1.1)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          },
        }}
      >
        <ArrowRight />
      </IconButton>

      {/* Slide Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 3,
        }}
      >
        {sliders.map((_, index) => (
          <Box
            key={index}
            onClick={() => setSlideIndex(index)}
            sx={{
              width: slideIndex === index ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: slideIndex === index ? 'white' : alpha(theme.palette.common.white, 0.5),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Slider;
