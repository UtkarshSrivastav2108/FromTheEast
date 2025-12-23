import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrdersProvider } from './context/OrdersContext';
import { SnackbarProvider } from './context/SnackbarContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Product from './pages/Product';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Reservation from './pages/Reservation';

/**
 * Main App Component
 * Wraps all routes with context providers for state management
 */
function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrdersProvider>
              <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#fafafa',
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:category" element={<ProductList />} />
                <Route path="/product/:id" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* Protected Routes - Require Authentication */}
                  <Route
                    path="/reservation"
                    element={
                      <ProtectedRoute>
                        <Reservation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
              </Routes>
            </Box>
              </Router>
            </OrdersProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;






