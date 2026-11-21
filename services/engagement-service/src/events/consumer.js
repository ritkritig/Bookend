const amqp = require('amqplib');
const config = require('../config');
const db = require('../models/db');
const { evaluateAchievements } = require('../rules/achievements');
const { evaluateChallenges } = require('../rules/challenges');

let channel = null;
let connection = null;

function handleDomainEvent(eventData) {
  const { eventId, eventType, occurredAt, payload } = eventData;

  if (!eventId || !eventType) {
    console.warn('[ENGAGEMENT CONSUMER] Malformed event received:', eventData);
    return false;
  }

  // STRICT IDEMPOTENCY CHECK
  const existing = db.prepare('SELECT event_id FROM processed_events WHERE event_id = ?').get(eventId);
  if (existing) {
    console.log(`[IDEMPOTENT SKIP] Event ${eventId} (${eventType}) was already processed. Skipping duplicate execution.`);
    return true;
  }

  console.log(`[ENGAGEMENT CONSUMER] Processing domain event: ${eventType} (ID: ${eventId})`);

  // 1. Evaluate achievements rules
  evaluateAchievements(eventType, payload || {});

  // 2. Evaluate challenges progress and streaks
  evaluateChallenges(eventType, payload || {});

  // 3. Mark event as processed
  db.prepare(`
    INSERT INTO processed_events (event_id, event_type)
    VALUES (?, ?)
  `).run(eventId, eventType);

  return true;
}

async function startConsumer() {
  try {
    console.log(`[ENGAGEMENT CONSUMER] Connecting to RabbitMQ at ${config.rabbitMqUrl}...`);
    connection = await amqp.connect(config.rabbitMqUrl);
    channel = await connection.createChannel();

    await channel.assertExchange(config.exchange, 'topic', { durable: true });
    const q = await channel.assertQueue(config.queueName, { durable: true });

    const routingKeys = [
      'book.completed',
      'book.rated',
      'reading.progress.updated',
      'story.published',
      'story.liked',
      'adaptation.voted'
    ];

    for (const key of routingKeys) {
      await channel.bindQueue(q.queue, config.exchange, key);
    }

    channel.prefetch(1);
    console.log(`[ENGAGEMENT CONSUMER] Listening on queue '${q.queue}' for keys: ${routingKeys.join(', ')}`);

    channel.consume(q.queue, (msg) => {
      if (!msg) return;

      try {
        const eventData = JSON.parse(msg.content.toString());
        const processed = handleDomainEvent(eventData);
        if (processed) {
          channel.ack(msg);
        } else {
          channel.nack(msg, false, false);
        }
      } catch (err) {
        console.error('[ENGAGEMENT CONSUMER] Error handling message:', err.message);
        channel.nack(msg, false, false);
      }
    });

    connection.on('error', (err) => {
      console.error('[ENGAGEMENT CONSUMER] Connection error:', err.message);
      setTimeout(startConsumer, 5000);
    });

    connection.on('close', () => {
      console.warn('[ENGAGEMENT CONSUMER] Connection closed. Reconnecting...');
      setTimeout(startConsumer, 5000);
    });

  } catch (err) {
    console.warn(`[ENGAGEMENT CONSUMER] RabbitMQ not reachable (${err.message}). Retrying in 7s...`);
    setTimeout(startConsumer, 7000);
  }
}

module.exports = {
  startConsumer,
  handleDomainEvent
};
