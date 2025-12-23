import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  MailOutline,
  Phone,
  Pinterest,
  Room,
  Twitter,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const socialIcons = [
    { icon: <Facebook />, color: '#3B5999', href: '#' },
    { icon: <Instagram />, color: '#E4405F', href: '#' },
    { icon: <Twitter />, color: '#55ACEE', href: '#' },
    { icon: <Pinterest />, color: '#E60023', href: '#' },
  ];

  const usefulLinks = [
    { text: 'Home', href: '/' },
    { text: 'Menu', href: '/products' },
    { text: 'Cart', href: '/cart' },
    { text: 'Wishlist', href: '/wishlist' },
    { text: 'Orders', href: '/orders' },
    { text: 'Profile', href: '/profile' },
    { text: 'Reservations', href: '/' },
    { text: 'About Us', href: '/' },
    { text: 'Contact', href: '/' },
    { text: 'Terms', href: '/' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'rgba(255, 255, 255, 0.9)',
        padding: { xs: '32px 16px', md: '40px 24px' },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                marginBottom: 1.5,
                background: 'linear-gradient(135deg, #d32f2f 0%, #ff6f00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FROM THE EAST
            </Typography>
            <Divider
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                marginBottom: 2,
                width: '50px',
                height: '2px',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                marginBottom: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.6,
                fontSize: '0.8rem',
              }}
            >
              Authentic Asian cuisine featuring regional specialties from Central, East, South, and Southeast Asia. 
              Experience culinary traditions crafted with premium ingredients and time-honored recipes.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialIcons.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: social.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 12px ${social.color}40`,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: 1.5,
                color: 'white',
              }}
            >
              Quick Links
            </Typography>
            <Divider
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                marginBottom: 2,
                width: '50px',
                height: '2px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  flex: 1,
                }}
              >
                {usefulLinks.slice(0, 5).map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: 'primary.main',
                        paddingLeft: '4px',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  flex: 1,
                }}
              >
                {usefulLinks.slice(5).map((link, index) => (
                  <Link
                    key={index + 5}
                    href={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: 'primary.main',
                        paddingLeft: '4px',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: 1.5,
                color: 'white',
              }}
            >
              Contact Us
            </Typography>
            <Divider
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                marginBottom: 1.5,
                width: '50px',
                height: '2px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Room
                  sx={{
                    color: 'primary.main',
                    marginTop: 0.25,
                    fontSize: '18px',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    fontSize: '0.8rem',
                  }}
                >
                  622 Sector 48, Faridabad<br />
                  Haryana 121001, India
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone
                  sx={{
                    color: 'primary.main',
                    fontSize: '18px',
                  }}
                />
                <Link
                  href="tel:+919873029249"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    fontSize: '0.8rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  +91 9873029249
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MailOutline
                  sx={{
                    color: 'primary.main',
                    fontSize: '18px',
                  }}
                />
                <Link
                  href="mailto:contact@utkarshsri.dev"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    fontSize: '0.8rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  contact@utkarshsri.dev
                </Link>
              </Box>
            </Box>
            <Box
              component="img"
              src="https://i.ibb.co/Qfvn4z6/payment.png"
              alt="payment methods"
              sx={{
                width: '60%',
                marginTop: 2,
                opacity: 0.8,
              }}
            />
          </Grid>
        </Grid>

        {/* Copyright */}
        <Divider
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginTop: 3,
            marginBottom: 2,
          }}
        />
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.875rem',
            }}
          >
            © {new Date().getFullYear()} From The East. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
