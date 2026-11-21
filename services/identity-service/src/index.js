const express = require('express');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const { seedUsers } = require('./seed/seed');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Correlation ID logger
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || 'no-req-id';
  console.log(`[IDENTITY] [${reqId}] ${req.method} ${req.path}`);
  next();
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: config.serviceName,
    port: config.port,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[IDENTITY ERROR]', err);
  res.status(500).json({ error: 'Internal server error in identity service.' });
});

// Seed demo users on launch
seedUsers();

app.listen(config.port, () => {
  console.log(`[IDENTITY SERVICE] Running on port ${config.port}`);
});
