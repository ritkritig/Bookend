const express = require('express');
const cors = require('cors');
const config = require('./config');
const storylabRoutes = require('./routes/storylab.routes');
const { seedSocial } = require('./seed/seed');
const { initRabbitMQ } = require('./events/publisher');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || 'no-req-id';
  console.log(`[SOCIAL] [${reqId}] ${req.method} ${req.path}`);
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

// Routes
app.use('/api/storylab', storylabRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('[SOCIAL ERROR]', err);
  res.status(500).json({ error: 'Internal server error in social service.' });
});

// Seed data
seedSocial();

// Init RabbitMQ publisher
initRabbitMQ();

app.listen(config.port, () => {
  console.log(`[SOCIAL SERVICE] Running on port ${config.port}`);
});
