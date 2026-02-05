# Quickstart Guide: Advanced Restaurant Platform Features

## Overview
This guide provides instructions for setting up, configuring, and running the restaurant platform features including reservations, menu management, online ordering, and order tracking.

## Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- Redis server installed and running (for real-time features)
- Google Maps API key (for location services)
- Stripe API key (for payments)
- SMTP server or email service credentials

## Installation

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install shared dependencies (if any)
cd ../shared
npm install
```

### 2. Environment Configuration
Create `.env` files in both backend and frontend directories:

**Backend (.env):**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/restaurant_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_SOCKET_URL=ws://localhost:3001
```

### 3. Database Setup
```bash
# Navigate to backend directory
cd backend

# Run database migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:3001`

### 2. Start Frontend Server
In a new terminal:
```bash
cd frontend
npm run start
```
The frontend server will start on `http://localhost:3000`

### 3. Start Real-time Service
If using a separate WebSocket service:
```bash
cd backend
npm run socket-server
```

## Key Features Setup

### 1. Reservation System
- Access the reservation calendar at `/reservations`
- Configure restaurant hours in the admin panel
- Set up table configurations and capacities
- Enable email confirmations in settings

### 2. Menu Management
- Add menu items through the admin panel at `/admin/menu`
- Configure categories and dietary options
- Set seasonal availability for items
- Upload images for menu items

### 3. Ordering System
- Configure payment gateways (Stripe)
- Set delivery zones and fees
- Configure pickup/delivery time windows
- Enable order notifications

### 4. Order Tracking
- Real-time updates will appear automatically
- Configure status update triggers
- Set up SMS notifications if needed

## Configuration Options

### Performance Settings
```javascript
// In backend/config/performance.js
module.exports = {
  maxConcurrentReservations: 100,
  orderPollInterval: 30000, // 30 seconds
  imageCacheTTL: 3600, // 1 hour
  sessionTimeout: 3600 // 1 hour
};
```

### Business Hours
```javascript
// In backend/config/business-hours.js
module.exports = {
  timezone: 'America/New_York',
  hours: {
    monday: { open: '11:00', close: '22:00' },
    tuesday: { open: '11:00', close: '22:00' },
    wednesday: { open: '11:00', close: '22:00' },
    thursday: { open: '11:00', close: '22:00' },
    friday: { open: '11:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '21:00' }
  },
  reservationBuffer: 15 // 15 minutes between reservations
};
```

## API Endpoints

### Reservations
- `GET /api/reservations/availability` - Check table availability
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/:id` - Get reservation details
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get menu categories
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/menu/search` - Search menu items

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/tracking/:trackingId` - Track order status

### Real-time Updates
- WebSocket connection at `ws://localhost:3001/socket`
- Events: `order-status-update`, `reservation-confirmed`, `menu-updated`

## Testing

### Unit Tests
```bash
# Backend tests
cd backend
npm run test:unit

# Frontend tests
cd frontend
npm run test:unit
```

### Integration Tests
```bash
# Run all integration tests
npm run test:integration
```

### End-to-End Tests
```bash
# Start application and run E2E tests
npm run test:e2e
```

## Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend (if needed)
cd backend
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod_username:prod_password@prod_host:5432/prod_db
REDIS_URL=redis://prod_redis_host:6379
JWT_SECRET=secure_production_secret
# ... other production variables
```

## Troubleshooting

### Common Issues
1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in environment variables
   - Run `npx prisma db pull` to verify connection

2. **Real-time Updates Not Working**
   - Verify Redis server is running
   - Check WebSocket connection in browser console
   - Ensure CORS settings allow WebSocket connections

3. **Payment Processing Issues**
   - Verify Stripe API keys are correct
   - Check webhook endpoints are configured
   - Review payment method availability in Stripe dashboard

### Logging
- Backend logs: Check `logs/app.log` and `logs/error.log`
- Frontend errors: Check browser console
- Database queries: Enable query logging in Prisma config

## Admin Panel Access
- Navigate to `/admin` for administrative functions
- Default admin credentials are set during database seeding
- Configure admin users through the admin panel