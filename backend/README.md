# From The East - Backend API

Backend API for From The East restaurant application built with Node.js, Express.js, and MongoDB.

## Features

- User Authentication (Register, Login, JWT)
- Product Management
- Shopping Cart
- Wishlist
- Order Management
- User Profile
- Table Reservations

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fromtheeast
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin, Protected)
- `PUT /api/products/:id` - Update product (Admin, Protected)
- `DELETE /api/products/:id` - Delete product (Admin, Protected)

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item quantity (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (Protected)
- `POST /api/wishlist` - Add item to wishlist (Protected)
- `DELETE /api/wishlist/:itemId` - Remove item from wishlist (Protected)
- `DELETE /api/wishlist` - Clear wishlist (Protected)

### Orders
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `POST /api/orders` - Create order from cart (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin, Protected)

### Profile
- `GET /api/profile` - Get user profile (Protected)
- `PUT /api/profile` - Update user profile (Protected)
- `PUT /api/profile/password` - Change password (Protected)

### Reservations
- `GET /api/reservations` - Get user's reservations (Protected)
- `GET /api/reservations/:id` - Get single reservation (Protected)
- `POST /api/reservations` - Create reservation (Protected)
- `PUT /api/reservations/:id` - Update reservation (Protected)
- `DELETE /api/reservations/:id` - Cancel reservation (Protected)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Models

### User
- firstName, lastName, username, email, password
- phone, address, role

### Product
- name, description, price, image
- category, isVeg, badges, featured, available

### Order
- user, items, subtotal, deliveryFee, discount, total
- address, paymentMethod, status, orderNumber

### Cart
- user, items

### Wishlist
- user, items

### Reservation
- user, name, email, phone, guests
- date, time, status, specialRequests

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## Development

The server runs on `http://localhost:5000` by default.

Health check endpoint: `GET /api/health`

