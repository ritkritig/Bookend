const path = require('path');
require('dotenv').config();

module.exports = {
  port: parseInt(process.env.IDENTITY_PORT || (process.env.PORT && process.env.PORT !== '4000' ? process.env.PORT : 4001), 10),
  serviceName: 'identity-service',
  jwtSecret: process.env.JWT_SECRET || 'bookend_super_secure_jwt_secret_editorial_2026_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'identity.db'),
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'bookend.events',
};
