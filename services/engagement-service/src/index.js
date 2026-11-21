const express = require('express');
const cors = require('cors');
const config = require('./config');
const readquestRoutes = require('./routes/readquest.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const { seedEngagement } = require('./seed/seed');
const { startConsumer } = require('./events/consumer');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Correlation ID Logger
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || 'no-req-id';
  console.log(`[ENGAGEMENT] [${reqId}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: config.serviceName,
    port: config.port,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/readquest', readquestRoutes);
app.use('/api/notifications', notificationsRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('[ENGAGEMENT ERROR]', err);
  res.status(500).json({ error: 'Internal server error in engagement service.' });
});

// Seed data
seedEngagement();

// Start RabbitMQ consumer
startConsumer();

app.listen(config.port, () => {
  console.log(`[ENGAGEMENT SERVICE] Running on port ${config.port}`);
});
