import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { useAnnouncement } from '../hooks/useAnnouncement';

const Announcement = () => {
  const { announcement } = useAnnouncement();

  // Don't render if no announcement
  if (!announcement) {
    return null;
  }

  return (
    <Box
      sx={{
        height: { xs: '28px', sm: '32px' },
        backgroundColor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shimmer 3s infinite',
        },
        '@keyframes shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          fontSize: { xs: '10px', sm: '12px' },
          letterSpacing: '0.5px',
          zIndex: 1,
        }}
      >
        {announcement.message}
      </Typography>
    </Box>
  );
};

export default Announcement;
