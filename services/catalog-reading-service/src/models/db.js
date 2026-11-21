const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure directory exists
const dir = path.dirname(config.dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new DatabaseSync(config.dbPath);
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    published_year INTEGER NOT NULL,
    page_count INTEGER NOT NULL,
    genres TEXT NOT NULL, -- JSON array
    average_rating REAL DEFAULT 0.0,
    ratings_count INTEGER DEFAULT 0,
    editorial_quote TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS adaptations (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Movie', 'TV Series', 'Miniseries'
    director_or_creator TEXT,
    cast_summary TEXT,
    release_year INTEGER NOT NULL,
    poster_url TEXT NOT NULL,
    synopsis TEXT,
    book_votes INTEGER DEFAULT 0,
    screen_votes INTEGER DEFAULT 0,
    faithfulness_score REAL DEFAULT 0.0,
    casting_score REAL DEFAULT 0.0,
    story_score REAL DEFAULT 0.0,
    overall_score REAL DEFAULT 0.0,
    ratings_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(book_id) REFERENCES books(id)
  );

  CREATE TABLE IF NOT EXISTS adaptation_votes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    adaptation_id TEXT NOT NULL,
    preferred TEXT NOT NULL, -- 'book' or 'screen'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, adaptation_id)
  );

  CREATE TABLE IF NOT EXISTS adaptation_ratings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    adaptation_id TEXT NOT NULL,
    faithfulness INTEGER,
    casting INTEGER,
    story INTEGER,
    overall INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, adaptation_id)
  );

  CREATE TABLE IF NOT EXISTS user_library (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    shelf TEXT NOT NULL, -- 'want_to_read', 'currently_reading', 'completed', 'favorites'
    current_page INTEGER DEFAULT 0,
    is_favorite INTEGER DEFAULT 0,
    started_at DATETIME,
    completed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
  );

  CREATE TABLE IF NOT EXISTS ratings_reviews (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    book_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    review_title TEXT,
    review_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
  );
`);

module.exports = db;
