const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

let channel = null;
let connection = null;
const offlineQueue = [];
let isConnecting = false;

async function initRabbitMQ() {
  if (isConnecting || channel) return;
  isConnecting = true;

  try {
    console.log(`[EVENT PUBLISHER] Connecting to RabbitMQ at ${config.rabbitMqUrl}...`);
    connection = await amqp.connect(config.rabbitMqUrl);
    channel = await connection.createChannel();

    await channel.assertExchange(config.exchange, 'topic', { durable: true });
    console.log(`[EVENT PUBLISHER] Connected to RabbitMQ exchange '${config.exchange}'.`);
    isConnecting = false;

    // Flush any pending events buffered during offline startup
    while (offlineQueue.length > 0) {
      const item = offlineQueue.shift();
      publishEvent(item.routingKey, item.eventType, item.payload);
    }

    connection.on('error', (err) => {
      console.error('[EVENT PUBLISHER] RabbitMQ connection error:', err.message);
      channel = null;
      connection = null;
      setTimeout(initRabbitMQ, 5000);
    });

    connection.on('close', () => {
      console.warn('[EVENT PUBLISHER] RabbitMQ connection closed. Reconnecting in 5s...');
      channel = null;
      connection = null;
      setTimeout(initRabbitMQ, 5000);
    });
  } catch (err) {
    isConnecting = false;
    console.warn(`[EVENT PUBLISHER] RabbitMQ not reachable yet (${err.message}). Buffering events in memory.`);
    setTimeout(initRabbitMQ, 7000);
  }
}

// Publish an event
function publishEvent(routingKey, eventType, payload) {
  const eventMessage = {
    eventId: `evt_${Date.now()}_${uuidv4().substring(0, 8)}`,
    eventType,
    occurredAt: new Date().toISOString(),
    payload
  };

  const content = Buffer.from(JSON.stringify(eventMessage));

  if (channel) {
    try {
      channel.publish(config.exchange, routingKey, content, {
        persistent: true,
        contentType: 'application/json'
      });
      console.log(`[EVENT PUBLISHER] Published [${eventType}] (ID: ${eventMessage.eventId}) to key '${routingKey}'`);
    } catch (err) {
      console.error(`[EVENT PUBLISHER] Error publishing event ${eventType}:`, err.message);
      offlineQueue.push({ routingKey, eventType, payload });
    }
  } else {
    console.warn(`[EVENT PUBLISHER] RabbitMQ offline. Queued [${eventType}] in memory buffer (Queue size: ${offlineQueue.length + 1}).`);
    offlineQueue.push({ routingKey, eventType, payload });
  }

  // Also broadcast to direct local HTTP webhook endpoints if available (for zero-config local testing)
  dispatchLocalWebhook(eventType, eventMessage).catch(() => {});

  return eventMessage;
}

// Direct local webhook helper for standalone microservices
async function dispatchLocalWebhook(eventType, eventMessage) {
  const endpoints = [
    'http://localhost:4004/api/recommendations/events',
    'http://localhost:4005/api/readquest/events'
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventMessage),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // Standalone fallback: silent ignore if target endpoint not running or down
    }
  }
}

module.exports = {
  initRabbitMQ,
  publishEvent
};
