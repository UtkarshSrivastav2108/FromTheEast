import React from 'react';
import { Box, IconButton } from '@mui/material';
import { PlayCircleOutline } from '@mui/icons-material';

const VideoBanner = () => {
  return (
    <Box
      sx={{
        flex: 1,
        margin: 0.375,
        height: '70vh',
        position: 'relative',
      }}
    >
      <Box
        component="img"
        src="/assets/image/video.png"
        alt="video banner"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.2s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.5s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.432)',
            transition: 'background-color 0.9s ease',
          },
        }}
      >
        <IconButton
          sx={{
            transition: 'all 0.5s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <PlayCircleOutline
            sx={{
              color: 'white',
              fontSize: '70px',
              cursor: 'pointer',
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default VideoBanner;
