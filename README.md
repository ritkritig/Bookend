# 📚 Bookend — Social Discovery Ecosystem for Books & Screen Adaptations

> A production-grade, distributed microservices platform connecting book discovery, cinematic book-to-screen adaptations, explainable recommendations, reader compatibility matching, and transformative fan storytelling.

[![Microservices Architecture](https://img.shields.io/badge/Architecture-Distributed%20Microservices-722F37?style=flat-square)](#architecture)
[![Event Driven](https://img.shields.io/badge/Messaging-RabbitMQ%20AMQP-C5A059?style=flat-square)](#asynchronous-messaging)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue?style=flat-square)](#frontend)
[![FastAPI](https://img.shields.io/badge/Recommendations-Python%20%2B%20FastAPI-009688?style=flat-square)](#recommendation-service)

---

## 🌟 Product Vision

Bookend is built for readers who believe stories do not end on the final page. It unifies:

- **Book Discovery & Personal Library**: Search by author, title, genre; track reading progress, and manage reading shelves.
- **Page to Screen**: Dedicated cinematic experience pairing books with movie and TV adaptations, featuring community voting on "Which did you prefer?" and multi-dimensional fidelity scoring.
- **NextRead Personalized Recommendations**: Explainable recommendation algorithm powered by Python, FastAPI, and content similarity vectors with human-readable rationale.
- **ShelfMatch**: Reader compatibility algorithm calculating taste synergy percentage, shared loved books, and unread discoveries from kindred readers.
- **StoryLab**: Transformative community creative portal for pitching alternate endings, sequel ideas, fan theories, character POV stories, and adaptation casting.
- **ReadQuest**: Gamified reading system featuring yearly goals, reading streaks, thematic challenges, and earned achievement badges.

---

## 🏛️ Microservices Architecture

Bookend is structured around **high cohesion** and **low coupling**. Every service runs as an independent process with its own database storage boundary.

```
                           +---------------------------+
                           |   React 19 + TypeScript   |
                           |   Vite SPA (Port 3000)    |
                           +-------------+-------------+
                                         |
                                  HTTP / REST (JSON)
                                         |
                           +-------------v-------------+
                           |        API Gateway        |
                           |  Node.js (Port 4000)      |
                           +------+--------------+-----+
                                  |              |
         +------------------------+              +------------------------+
         |                        |              |                        |
+--------v-------+       +--------v-------+ +----v-----------+  +---------v--------+
| Identity Svc   |       | Catalog Svc    | | Social Svc     |  | Recommendation   |
| Node.js / SQL  |       | Node.js / SQL  | | Node.js / SQL  |  | Python / FastAPI |
| (Port 4001)    |       | (Port 4002)    | | (Port 4003)    |  | (Port 4004)      |
+----------------+       +--------+-------+ +----+-----------+  +---------^--------+
                                  |              |                        |
                                  | Publishes    | Publishes              | Consumes
                                  v              v                        |
                         +-----------------------------------+            |
                         |     RabbitMQ Message Broker       +------------+
                         |     Exchange: bookend.events      |
                         +-----------------+-----------------+
                                           |
                                           | Consumes
                                           v
                                 +-------------------+
                                 | Engagement Svc    |
                                 | Node.js / SQL     |
                                 | (Port 4005)       |
                                 +-------------------+
```

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (All-in-One Containerized Setup)

Ensure Docker Desktop is running, then clone and launch:

```bash
cd D:\sem5\projects\bookend
docker compose up --build
```

This starts:
- **RabbitMQ**: `localhost:5672` (Management Dashboard at `http://localhost:15672` `guest:guest`)
- **API Gateway**: `http://localhost:4000`
- **Identity Service**: `http://localhost:4001`
- **Catalog & Reading Service**: `http://localhost:4002`
- **Social Service**: `http://localhost:4003`
- **Recommendation Service**: `http://localhost:4004`
- **Engagement Service**: `http://localhost:4005`
- **Frontend SPA**: `http://localhost:3000`

---

### Option 2: Standalone Local Development (Zero Docker Required)

Bookend includes an in-memory event bus fallback and isolated SQLite storage, allowing you to run directly on your host machine without external database or RabbitMQ dependencies!

#### 1. Seed All Databases
```bash
npm run seed:all
```

#### 2. Start Services (in separate terminal tabs or background)
```bash
# Terminal 1: API Gateway
npm run dev:gateway

# Terminal 2: Identity Service
npm run dev:identity

# Terminal 3: Catalog & Reading Service
npm run dev:catalog

# Terminal 4: Social Service
npm run dev:social

# Terminal 5: Recommendation Service (Python)
npm run dev:recommendation

# Terminal 6: Engagement Service
npm run dev:engagement

# Terminal 7: Frontend Application
npm run dev:frontend
```

Now open **`http://localhost:3000`** in your browser!

---

## 🎭 15-Step University Presentation & Live Demo Script

Follow this exact walkthrough to demonstrate the full end-to-end microservices flow:

| Step | Action | Feature Highlighted | Technical Verification |
| :--- | :--- | :--- | :--- |
| **1** | Open `http://localhost:3000` | Discovery Feed | Identity Service automatically establishes session for demo reader **Elena Vance**. |
| **2** | Click **"Books"** in top navbar | Catalog Discovery | Catalog Service handles query (`GET /api/books`), returning rich covers, genres, and ratings. |
| **3** | Click into **"Dune"** | Central Book Hub | Book Detail aggregates catalog data, reading status, adaptations, and community theories. |
| **4** | Scroll to **"Cinematic Adaptations"** | Page to Screen | View Denis Villeneuve's *Dune (2021)* & *Dune: Part Two (2024)* with casting details. |
| **5** | Cast a vote on **"Which did you prefer?"** | Community Polling | Publishes `adaptation.voted` event; updates percentage distribution in real time. |
| **6** | Click **"Add to Personal Library"** | Personal Shelves | Move *Dune* to **"Currently Reading"** and drag progress slider to 688 pages (100%). |
| **7** | Click **"Save Shelf"** | Event-Driven Workflow | Catalog Service updates shelf to `completed`, triggers `confetti`, and publishes **`book.completed`**. |
| **8** | Inspect Message Broker | Asynchronous AMQP | RabbitMQ distributes `book.completed` to both Recommendation and Engagement queues. |
| **9** | Open **"NextRead"** in navbar | Explainable AI | Python FastAPI recalculates taste vector; recommends *Station Eleven* with human-readable rationale: *"Because you loved Dune and epic worldbuilding"*. |
| **10** | Open **"ReadQuest"** in navbar | Gamification Engine | Engagement Service consumed the event and unlocked **"First Finish"** and advanced the **"Page to Screen"** challenge! |
| **11** | Open **"ShelfMatch"** in navbar | Reader Compatibility | Cosine similarity matches Elena (94%) with **Aria Chen** based on shared loved classics. |
| **12** | Inspect **"Discoveries from Reader"** | Social Discovery | Unread recommendations loved by matched readers appear dynamically. |
| **13** | Open **"StoryLab"** in navbar | Creative Community | Filter by *Alternate Ending* or *Fan Theory* with spoiler blur protection. |
| **14** | Click **"Publish Creation"** | Social Microservice | Publish an adaptation pitch; publishes `story.published` event to RabbitMQ. |
| **15** | Open **"Architecture"** in navbar | Microservices Defense | Live service health monitor pings all microservices via `/api/health/all`, displaying active status and event diagrams! |

---

## 🧪 Testing & Verification

Bookend includes automated test suites covering auth, catalog queries, event-driven workflows, and recommendation mathematics:

```bash
# Run all test suites
npm test
```

### What is tested:
- **`tests/integration-event-flow.test.js`**:
  - Simulates `book.completed` domain event dispatch.
  - Verifies achievement unlock (`ach_first_finish`) in Engagement Service.
  - Verifies challenge progression (`ch_page_to_screen`).
  - **Strict Idempotency Verification**: Dispatches the exact duplicate event ID a second time and verifies counters and notifications do not duplicate.
- **`services/recommendation-service/tests/test_engine.py`**:
  - Vector cosine similarity calculation.
  - User taste vector recalibration from activity.
  - Explainable recommendation output format.
  - ShelfMatch reader compatibility scoring.

---

## 📂 Project Structure

```
bookend/
├── docker-compose.yml              # Multi-container orchestration
├── package.json                    # Root workspace & orchestration scripts
├── MICROSERVICES_ARCHITECTURE.md   # Architectural design, trade-offs, and defense guide
├── README.md                       # Product documentation & demo script
├── services/
│   ├── api-gateway/                # Node.js Express reverse proxy (Port 4000)
│   ├── identity-service/           # JWT auth, user profiles, passwords (Port 4001)
│   ├── catalog-reading-service/    # Books, adaptations, reviews, shelves (Port 4002)
│   ├── social-service/             # StoryLab fan theories, pitches, likes (Port 4003)
│   ├── recommendation-service/     # Python FastAPI NextRead & ShelfMatch (Port 4004)
│   └── engagement-service/         # ReadQuest challenges, achievements, streaks (Port 4005)
├── frontend/                       # React 19 + TypeScript + Tailwind CSS SPA (Port 3000)
├── scripts/
│   └── seed-all.js                 # Unified database seeder
└── tests/
    ├── integration-event-flow.test.js
    └── run-all-tests.js
```

---

## 📜 Architectural Defense Talking Points for Interviews

1. **Why not a Monolith?**
   *"For a small hobby app, a monolith would be simpler. Bookend intentionally adopts microservices to demonstrate domain decomposition, fault isolation, and technology flexibility: our NextRead engine runs on Python/FastAPI for vector mathematics, while our Gateway and Catalog run on Node.js."*

2. **How do you handle Distributed Transactions?**
   *"Instead of 2-Phase Commit (which introduces blocking latency), Bookend utilizes asynchronous Eventual Consistency via RabbitMQ domain events (`book.completed`, `book.rated`). Consumers process events idempotently using a deduplication table."*

3. **What happens if a downstream service crashes?**
   *"Fault isolation guarantees that if the Recommendation Service or Notification consumer is temporarily down, core user functions (login, browsing, reading, reviewing) continue without disruption. RabbitMQ queues incoming messages and delivers them once the service recovers."*

---

*Crafted with pride by the Bookend Engineering Team.*
