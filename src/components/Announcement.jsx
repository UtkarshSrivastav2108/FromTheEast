import React, { useMemo } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { useCoupons } from '../hooks/useCoupons';

/**
 * Announcement Component
 * Displays dynamic promotional messages based on available coupons
 */
const Announcement = () => {
  const { coupons, loading } = useCoupons();

  /**
   * Get the best promotional message from available coupons
   */
  const announcementMessage = useMemo(() => {
    if (loading) {
      return '🎉 Special Offers Available!';
    }

    // Handle case where coupons might be undefined or not an array
    if (!coupons || !Array.isArray(coupons) || coupons.length === 0) {
      return '🎉 Super Deal! Free Shipping on Orders Over ₹50';
    }

    // Find the best coupon (highest discount value, lowest minimum amount)
    const bestCoupon = coupons.reduce((best, coupon) => {
      if (!best) return coupon;
      
      // Prioritize coupons with lower minimum amount
      if (coupon.minAmount < best.minAmount) return coupon;
      if (coupon.minAmount > best.minAmount) return best;
      
      // If same min amount, prioritize higher discount
      if (coupon.discountType === 'percentage' && best.discountType === 'percentage') {
        return coupon.discountValue > best.discountValue ? coupon : best;
      }
      if (coupon.discountType === 'fixed' && best.discountType === 'fixed') {
        return coupon.discountValue > best.discountValue ? coupon : best;
      }
      
      // Percentage discounts are generally more attractive
      if (coupon.discountType === 'percentage') return coupon;
      if (best.discountType === 'percentage') return best;
      
      return best;
    }, null);

    if (!bestCoupon) {
      return '🎉 Super Deal! Free Shipping on Orders Over ₹50';
    }

    // Build dynamic message based on coupon
    const discountText = bestCoupon.discountType === 'percentage'
      ? `${bestCoupon.discountValue}% off`
      : `₹${bestCoupon.discountValue} off`;
    
    const minAmountText = bestCoupon.minAmount > 0
      ? ` on orders over ₹${bestCoupon.minAmount}`
      : '';
    
    const emoji = bestCoupon.discountValue >= 20 ? '🎉' : bestCoupon.discountValue >= 10 ? '✨' : '💫';
    
    return `${emoji} Use code ${bestCoupon.code} for ${discountText}${minAmountText}!`;
  }, [coupons, loading]);

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
          textAlign: 'center',
          px: 1,
        }}
      >
        {announcementMessage}
      </Typography>
    </Box>
  );
};

export default Announcement;
