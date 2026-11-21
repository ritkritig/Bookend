const express = require('express');
const cors = require('cors');
const config = require('./config');
const booksRoutes = require('./routes/books.routes');
const adaptationsRoutes = require('./routes/adaptations.routes');
const libraryRoutes = require('./routes/library.routes');
const ratingsRoutes = require('./routes/ratings.routes');
const { seedCatalog } = require('./seed/seed');
const { initRabbitMQ } = require('./events/publisher');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Correlation ID Logger
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || 'no-req-id';
  console.log(`[CATALOG] [${reqId}] ${req.method} ${req.path}`);
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

// Mount Routes
app.use('/api/books', booksRoutes);
app.use('/api/adaptations', adaptationsRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/ratings', ratingsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[CATALOG ERROR]', err);
  res.status(500).json({ error: 'Internal server error in catalog service.' });
});

// Seed data
seedCatalog();

// Init RabbitMQ Event Publisher
initRabbitMQ();

app.listen(config.port, () => {
  console.log(`[CATALOG SERVICE] Running on port ${config.port}`);
});
