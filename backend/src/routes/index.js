const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const activoRoutes = require('./activos');

// Welcome message for API root
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SecureFlow API',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      health: '/health',
      auth: `${process.env.API_PREFIX || '/api'}/auth`,
      users: `${process.env.API_PREFIX || '/api'}/users`,
      activos: `${process.env.API_PREFIX || '/api'}/activos`,
    },
    documentation: 'Coming soon...',
    timestamp: new Date().toISOString()
  });
});

// Route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/activos', activoRoutes);

module.exports = router;