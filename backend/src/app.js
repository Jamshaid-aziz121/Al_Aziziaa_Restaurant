const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');

// Load environment variables
dotenv.config();

// Import middleware
const { globalLimiter } = require('./middleware/rateLimiter');

// Import routes
const reservationRoutes = require('./routes/reservations');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const statusRoutes = require('./routes/status');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');

// Import WebSocket initialization
const { initializeWebSocket } = require('./utils/websocket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(globalLimiter); // Apply global rate limiting
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Aziz Restaurant API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      reservations: '/api/reservations',
      menu: '/api/menu',
      orders: '/api/orders',
      status: '/api/status',
      dashboard: '/api/dashboard',
      admin: '/api/admin'
    },
    documentation: 'Visit /docs for API documentation'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler - must be placed after all routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware - must be placed after routes and 404 handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Initialize WebSocket server
initializeWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`WebSocket server initialized for real-time updates`);
});

module.exports = app;