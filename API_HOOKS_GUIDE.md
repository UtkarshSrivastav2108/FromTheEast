# API Hooks Guide

This document explains how to use the custom hooks for all backend APIs in the From The East application.

## Setup

1. **Environment Variable**: Add the backend API URL to your `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

2. **Import hooks** in your components:
```javascript
import { useProducts, useCart, useOrders } from '../hooks';
```

## Available Hooks

### 1. Authentication Hooks

#### `useAuth` (from AuthContext)
Already available via `AuthContext`. Provides:
- `isAuthenticated`: boolean
- `user`: user object
- `loading`: boolean
- `login(userData, token)`: function
- `logout()`: function

#### `useAuth` (from hooks/useAuth.js)
Additional auth operations:
```javascript
import { useAuth } from '../hooks/useAuth';

const { login, register, logout, loading, error } = useAuth();

// Register
await register({
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123'
});

// Login
await login({
  username: 'johndoe',
  password: 'password123'
});
```

### 2. Product Hooks

#### `useProducts`
Fetch all products with optional filters:
```javascript
import { useProducts } from '../hooks';

// Get all products
const { products, loading, error, refetch } = useProducts();

// Get products by category
const { products, loading, error } = useProducts({ category: 'ramen' });

// Get featured products
const { products, loading, error } = useProducts({ featured: true });
```

#### `useProduct`
Fetch a single product:
```javascript
import { useProduct } from '../hooks';

const { product, loading, error, refetch } = useProduct(productId);
```

### 3. Cart Hooks

#### `useCart`
Manage shopping cart:
```javascript
import { useCart } from '../hooks';

const {
  cart,           // Cart object with items
  loading,        // Loading state
  error,          // Error object
  addToCart,      // Add item to cart
  updateItem,     // Update item quantity
  removeItem,     // Remove item from cart
  clearCart,      // Clear entire cart
  refetch         // Refresh cart data
} = useCart();

// Add item
await addToCart({ productId: '123', quantity: 2 });

// Update quantity
await updateItem(itemId, 3);

// Remove item
await removeItem(itemId);

// Clear cart
await clearCart();
```

### 4. Wishlist Hooks

#### `useWishlist`
Manage wishlist:
```javascript
import { useWishlist } from '../hooks';

const {
  wishlist,              // Wishlist object with items
  loading,
  error,
  addToWishlist,        // Add item to wishlist
  removeFromWishlist,   // Remove item from wishlist
  clearWishlist,        // Clear wishlist
  isInWishlist,         // Check if product is in wishlist
  refetch
} = useWishlist();

// Add item
await addToWishlist({ productId: '123' });

// Remove item
await removeFromWishlist(itemId);

// Check if in wishlist
const isWishlisted = isInWishlist(productId);
```

### 5. Order Hooks

#### `useOrders`
Manage orders:
```javascript
import { useOrders } from '../hooks';

const {
  orders,         // Array of orders
  loading,
  error,
  createOrder,    // Create new order
  refetch
} = useOrders();

// Create order
await createOrder({
  items: cartItems,
  subtotal: 50.00,
  deliveryFee: 4.99,
  discount: 5.00,
  total: 49.99,
  address: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
    country: 'United States'
  },
  paymentMethod: 'card'
});
```

#### `useOrder`
Fetch a single order:
```javascript
import { useOrder } from '../hooks';

const { order, loading, error, refetch } = useOrder(orderId);
```

### 6. Profile Hooks

#### `useProfile`
Manage user profile:
```javascript
import { useProfile } from '../hooks';

const {
  profile,         // User profile object
  loading,
  error,
  updateProfile,   // Update profile
  changePassword,  // Change password
  refetch
} = useProfile();

// Update profile
await updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
    country: 'United States'
  }
});

// Change password
await changePassword({
  currentPassword: 'oldpass',
  newPassword: 'newpass'
});
```

### 7. Reservation Hooks

#### `useReservations`
Manage reservations:
```javascript
import { useReservations } from '../hooks';

const {
  reservations,        // Array of reservations
  loading,
  error,
  createReservation,  // Create reservation
  updateReservation,  // Update reservation
  cancelReservation,   // Cancel reservation
  refetch
} = useReservations();

// Create reservation
await createReservation({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  guests: 4,
  date: '2024-12-25',
  time: '19:00',
  specialRequests: 'Window seat preferred'
});

// Update reservation
await updateReservation(reservationId, {
  guests: 6,
  time: '20:00'
});

// Cancel reservation
await cancelReservation(reservationId);
```

#### `useReservation`
Fetch a single reservation:
```javascript
import { useReservation } from '../hooks';

const { reservation, loading, error, refetch } = useReservation(reservationId);
```

## Error Handling

All hooks return an `error` state. Handle errors in your components:

```javascript
const { products, loading, error } = useProducts();

if (error) {
  return <div>Error: {error.message}</div>;
}

if (loading) {
  return <div>Loading...</div>;
}

return <div>{/* Render products */}</div>;
```

## Example: Complete Component

```javascript
import React from 'react';
import { useProducts } from '../hooks';
import { CircularProgress, Alert, Grid } from '@mui/material';

const ProductList = () => {
  const { products, loading, error, refetch } = useProducts();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item key={product._id}>
          {/* Render product */}
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
```

## Notes

- All hooks automatically handle authentication tokens
- Protected routes require user to be logged in
- Hooks provide loading and error states for better UX
- Use `refetch` to manually refresh data when needed
- All async operations return promises for error handling

