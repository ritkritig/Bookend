const path = require('path');
require('dotenv').config();

module.exports = {
  port: parseInt(process.env.ENGAGEMENT_PORT || (process.env.PORT && process.env.PORT !== '4000' ? process.env.PORT : 4005), 10),
  serviceName: 'engagement-service',
  jwtSecret: process.env.JWT_SECRET || 'bookend_super_secure_jwt_secret_editorial_2026_key',
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'engagement.db'),
  rabbitMqUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'bookend.events',
  queueName: process.env.ENGAGEMENT_QUEUE || 'engagement-events-queue'
};
