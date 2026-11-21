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
    console.log(`[SOCIAL PUBLISHER] Connecting to RabbitMQ at ${config.rabbitMqUrl}...`);
    connection = await amqp.connect(config.rabbitMqUrl);
    channel = await connection.createChannel();

    await channel.assertExchange(config.exchange, 'topic', { durable: true });
    console.log(`[SOCIAL PUBLISHER] Connected to RabbitMQ exchange '${config.exchange}'.`);
    isConnecting = false;

    while (offlineQueue.length > 0) {
      const item = offlineQueue.shift();
      publishEvent(item.routingKey, item.eventType, item.payload);
    }

    connection.on('error', (err) => {
      console.error('[SOCIAL PUBLISHER] RabbitMQ error:', err.message);
      channel = null;
      connection = null;
      setTimeout(initRabbitMQ, 5000);
    });

    connection.on('close', () => {
      console.warn('[SOCIAL PUBLISHER] RabbitMQ closed. Reconnecting...');
      channel = null;
      connection = null;
      setTimeout(initRabbitMQ, 5000);
    });
  } catch (err) {
    isConnecting = false;
    console.warn(`[SOCIAL PUBLISHER] RabbitMQ not reachable yet (${err.message}). Buffering in memory.`);
    setTimeout(initRabbitMQ, 7000);
  }
}

function publishEvent(routingKey, eventType, payload) {
  const eventMessage = {
    eventId: `evt_${Date.now()}_${uuidv4().substring(0, 8)}`,
    eventType,
    occurredAt: new Date().toISOString(),
    payload
  };

  if (channel) {
    try {
      channel.publish(config.exchange, routingKey, Buffer.from(JSON.stringify(eventMessage)), {
        persistent: true,
        contentType: 'application/json'
      });
      console.log(`[SOCIAL PUBLISHER] Published [${eventType}] (ID: ${eventMessage.eventId}) to key '${routingKey}'`);
    } catch (err) {
      console.error(`[SOCIAL PUBLISHER] Error publishing:`, err.message);
      offlineQueue.push({ routingKey, eventType, payload });
    }
  } else {
    offlineQueue.push({ routingKey, eventType, payload });
  }

  // Local dispatch fallback for Engagement Service
  dispatchLocalWebhook(eventType, eventMessage).catch(() => {});

  return eventMessage;
}

async function dispatchLocalWebhook(eventType, eventMessage) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    await fetch('http://localhost:4005/api/readquest/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventMessage),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch {
    // Silent catch
  }
}

module.exports = { initRabbitMQ, publishEvent };
