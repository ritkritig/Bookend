import sqlite3
import os
from pathlib import Path
from app import config

db_file = Path(config.DB_PATH)
db_file.parent.mkdir(parents=True, exist_ok=True)

def get_db():
    conn = sqlite3.connect(str(db_file), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    with conn:
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("""
            CREATE TABLE IF NOT EXISTS processed_events (
                event_id TEXT PRIMARY KEY,
                event_type TEXT NOT NULL,
                processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS user_taste_profiles (
                user_id TEXT PRIMARY KEY,
                top_genres TEXT NOT NULL, -- JSON list
                taste_vector TEXT NOT NULL, -- JSON dict of feature weights
                favorite_authors TEXT NOT NULL, -- JSON list
                books_completed INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS user_ratings_cache (
                user_id TEXT NOT NULL,
                book_id TEXT NOT NULL,
                rating INTEGER NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, book_id)
            );
        """)
    conn.close()

def is_event_processed(event_id: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM processed_events WHERE event_id = ?", (event_id,))
    row = cursor.fetchone()
    conn.close()
    return row is not None

def mark_event_processed(event_id: str, event_type: str):
    conn = get_db()
    with conn:
        conn.execute(
            "INSERT OR IGNORE INTO processed_events (event_id, event_type) VALUES (?, ?)",
            (event_id, event_type)
        )
    conn.close()
