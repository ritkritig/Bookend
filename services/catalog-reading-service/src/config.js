const path = require('path');
require('dotenv').config();

module.exports = {
  port: parseInt(process.env.CATALOG_PORT || (process.env.PORT && process.env.PORT !== '4000' ? process.env.PORT : 4002), 10),
  serviceName: 'catalog-reading-service',
  jwtSecret: process.env.JWT_SECRET || 'bookend_super_secure_jwt_secret_editorial_2026_key',
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'catalog.db'),
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'bookend.events',
};
