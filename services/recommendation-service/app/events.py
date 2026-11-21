import pika
import json
import threading
import time
import logging
from app import config
from app.db import is_event_processed, mark_event_processed
from app.engine import DEMO_USER_PROFILES, build_user_vector_from_activity, SEED_BOOKS

logger = logging.getLogger("recommendation_consumer")

def handle_domain_event(event_data: dict) -> bool:
    """Idempotently handles incoming domain events."""
    event_id = event_data.get("eventId")
    event_type = event_data.get("eventType")
    payload = event_data.get("payload", {})

    if not event_id or not event_type:
        logger.warning(f"Event missing eventId or eventType: {event_data}")
        return False

    # IDEMPOTENCY CHECK
    if is_event_processed(event_id):
        logger.info(f"[IDEMPOTENCY] Event {event_id} ({event_type}) was already processed. Acknowledging and skipping.")
        return True

    logger.info(f"[EVENT CONSUMED] Processing {event_type} (ID: {event_id})")

    user_id = payload.get("userId")
    book_id = payload.get("bookId")

    # Update in-memory user taste model dynamically
    if user_id in DEMO_USER_PROFILES:
        profile = DEMO_USER_PROFILES[user_id]
        if event_type == "book.rated":
            rating = payload.get("rating", 5)
            profile["ratings"][book_id] = rating
            logger.info(f"Updated rating for {user_id}: {book_id} -> {rating} stars")
        elif event_type == "book.completed":
            if book_id not in profile["ratings"]:
                profile["ratings"][book_id] = 5
            logger.info(f"Book completed for {user_id}: {book_id}")

        # Recalculate taste vector
        new_vector = build_user_vector_from_activity(profile["ratings"], profile["favorites"])
        profile["taste_vector"].update(new_vector)
        logger.info(f"Taste profile recalculated for {user_id}. Vector updated.")

    # Record event ID in database to prevent future duplicate processing
    mark_event_processed(event_id, event_type)
    return True

def start_rabbitmq_consumer():
    """Background worker that continuously consumes events from RabbitMQ."""
    def run_worker():
        while True:
            try:
                logger.info(f"Connecting RabbitMQ consumer to {config.RABBITMQ_URL}...")
                params = pika.URLParameters(config.RABBITMQ_URL)
                connection = pika.BlockingConnection(params)
                channel = connection.channel()

                channel.exchange_declare(exchange=config.EXCHANGE, exchange_type='topic', durable=True)
                channel.queue_declare(queue=config.QUEUE_NAME, durable=True)

                # Bind relevant routing keys
                keys = ["book.completed", "book.rated", "reading.progress.updated"]
                for key in keys:
                    channel.queue_bind(exchange=config.EXCHANGE, queue=config.QUEUE_NAME, routing_key=key)

                def callback(ch, method, properties, body):
                    try:
                        event_data = json.loads(body.decode('utf-8'))
                        success = handle_domain_event(event_data)
                        if success:
                            ch.basic_ack(delivery_tag=method.delivery_tag)
                        else:
                            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
                    except Exception as ex:
                        logger.error(f"Error processing message: {ex}")
                        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

                channel.basic_qos(prefetch_count=1)
                channel.basic_consume(queue=config.QUEUE_NAME, on_message_callback=callback)

                logger.info(f"RabbitMQ consumer listening on queue '{config.QUEUE_NAME}' for keys {keys}")
                channel.start_consuming()

            except Exception as e:
                logger.warning(f"RabbitMQ consumer offline or connection dropped ({e}). Retrying in 7s...")
                time.sleep(7)

    t = threading.Thread(target=run_worker, daemon=True)
    t.start()
