# 📚 Bookend — Social Discovery for Books & Screen Adaptations

> An event-driven distributed microservices platform connecting book discovery, book-to-screen adaptations, explainable recommendations, reader compatibility matching, creative fan communities, and gamified reading.

[![Microservices Architecture](https://img.shields.io/badge/Architecture-Distributed%20Microservices-722F37?style=flat-square)](#-microservices-architecture)
[![Event Driven](https://img.shields.io/badge/Messaging-RabbitMQ%20AMQP-C5A059?style=flat-square)](#-communication-model)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue?style=flat-square)](#-technology-stack)
[![FastAPI](https://img.shields.io/badge/Recommendations-Python%20%2B%20FastAPI-009688?style=flat-square)](#-recommendation-service)

---

## 🌟 Overview

**Bookend** is a social reading and cross-media discovery platform built around the idea that a story does not necessarily end on its final page.

The platform allows readers to discover books, organize their personal libraries, explore movie and television adaptations, receive personalized recommendations, find readers with similar tastes, publish transformative fan content, and participate in reading challenges.

Beyond its product features, Bookend was designed as a practical exploration of **microservices and event-driven backend architecture**.

Rather than placing all backend functionality inside a single application, Bookend decomposes major business capabilities into independently running services that communicate through synchronous REST APIs and asynchronous RabbitMQ domain events.

---

## ✨ Core Features

### 📚 Book Discovery & Personal Library

Search and explore books by title, author, and genre.

Readers can organize books into personal shelves such as:

- Want to Read
- Currently Reading
- Completed
- Favorites

Reading progress, ratings, and reviews contribute to the reader's evolving taste profile.

---

### 🎬 Page to Screen

Discover the relationship between books and their movie or television adaptations.

Bookend supports discovery in both directions:

**Book → Movie / Series**

and

**Movie / Series → Original Book**

Readers can compare adaptations, vote on whether they preferred the book or screen version, and evaluate aspects such as adaptation faithfulness and casting.

---

### 🔍 NextRead

NextRead provides personalized and explainable recommendations using a dedicated **Python + FastAPI Recommendation Service**.

Recommendation signals include:

- previous ratings,
- completed books,
- favorite genres,
- library activity,
- content similarity,
- reader taste patterns.

Instead of returning only globally popular books, recommendations include human-readable explanations such as:

> Because you enjoyed *Dune* and epic worldbuilding.

The recommendation system can also surface relevant screen adaptations.

---

### 👯 ShelfMatch

ShelfMatch identifies readers with similar tastes.

Compatibility is calculated using signals such as:

- overlapping ratings,
- shared favorite genres,
- commonly loved books,
- reading history.

Users can discover books highly rated by compatible readers but not yet present in their own reading history.

---

### ✍️ StoryLab

StoryLab is Bookend's creative community space.

Readers can publish transformative fan content connected to books and adaptations, including:

- sequel ideas,
- alternate endings,
- fan theories,
- character POV concepts,
- adaptation pitches,
- dream casting.

StoryLab also supports likes, comments, bookmarks, spoiler protection, and content discovery.

---

### 🏆 ReadQuest

ReadQuest adds a gamified layer to reading.

Readers can:

- set yearly goals,
- maintain reading streaks,
- participate in themed challenges,
- track challenge progress,
- unlock achievements.

Examples include:

- **First Finish**
- **Page to Screen**
- **Genre Explorer**
- **Around the World**
- **Classics Challenge**

Achievements are derived from actual reading activity rather than being manually assigned.

---

# 🏛️ Microservices Architecture

Bookend is decomposed according to **business capabilities**, with the goal of maintaining **high cohesion within services and low coupling between services**.

Each backend service runs as an independent process and owns its corresponding data boundary.

```text
                           ┌───────────────────────────┐
                           │   React 19 + TypeScript   │
                           │      Frontend :3000       │
                           └─────────────┬─────────────┘
                                         │
                                   HTTP / REST
                                         │
                           ┌─────────────▼─────────────┐
                           │        API Gateway        │
                           │          :4000            │
                           └─────────────┬─────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              ▼                          ▼                          ▼
       Identity Service        Catalog & Reading             Social Service
           :4001                    :4002                        :4003
        Node.js/Express          Node.js/Express              Node.js/Express
              │                          │                          │
              │                          └──────────┬───────────────┘
              │                                     │
              │                              Domain Events
              │                                     ▼
              │                          ┌─────────────────────┐
              │                          │      RabbitMQ       │
              │                          │  bookend.events     │
              │                          └─────────┬───────────┘
              │                                    │
              │                       ┌────────────┴────────────┐
              │                       ▼                         ▼
              │              Recommendation              Engagement
              │                  Service                   Service
              │                   :4004                     :4005
              │              Python/FastAPI             Node.js/Express
              │
              └────────────────────────────────────────────────────────
```

---

## 🧩 Service Responsibilities

### API Gateway — Port 4000

Acts as the single backend entry point for the frontend.

Responsibilities include:

- request routing,
- forwarding requests to appropriate services,
- centralized API access,
- service health aggregation.

Business logic remains inside the individual services.

---

### Identity Service — Port 4001

Owns:

- registration,
- authentication,
- JWT handling,
- reader profiles,
- user preferences.

---

### Catalog & Reading Service — Port 4002

Owns:

- books,
- authors,
- adaptations,
- ratings,
- reviews,
- personal shelves,
- reading progress,
- completion status.

This service publishes reading-related domain events.

---

### Social Service — Port 4003

Owns StoryLab functionality including:

- creative posts,
- alternate endings,
- theories,
- adaptation pitches,
- likes,
- comments,
- bookmarks.

It can publish social events such as `story.published`.

---

### Recommendation Service — Port 4004

Implemented using **Python + FastAPI**.

Owns:

- NextRead,
- reader taste modelling,
- content similarity,
- recommendation ranking,
- ShelfMatch compatibility calculations,
- explainable recommendation output.

Using Python here demonstrates that independently deployed microservices can use technologies appropriate to their workloads.

---

### Engagement Service — Port 4005

Owns:

- ReadQuest,
- challenges,
- achievements,
- streaks,
- engagement notifications,
- asynchronous event consumption.

---

# 🔄 Communication Model

Bookend intentionally uses both **synchronous** and **asynchronous** communication.

## Synchronous REST

REST is used when the caller requires an immediate response.

Examples:

```text
Login
Search books
Retrieve book details
Open personal library
Fetch recommendations
Open ShelfMatch results
```

Conceptually:

```text
Frontend
   │
   ▼
API Gateway
   │
   ▼
Service
   │
   ▼
Immediate response
```

---

## Asynchronous Messaging

RabbitMQ is used for events describing something that has already happened.

Examples include:

```text
book.completed
book.rated
reading.progress.updated
adaptation.voted
story.published
achievement.unlocked
```

Example:

```text
User completes Dune
        │
        ▼
Catalog & Reading Service
        │
        │ book.completed
        ▼
     RabbitMQ
       /    \
      /      \
     ▼        ▼
Recommendation    Engagement
   Service          Service
     │                │
     ▼                ▼
Update taste      Update ReadQuest
profile           & achievements
```

The original request does not need to wait for recommendation recalculation or achievement processing.

This reduces direct dependencies between services.

---

# 🛡️ Idempotent Event Processing

Message brokers can deliver the same event more than once.

Bookend therefore treats event consumers as **idempotent**.

Every event includes information such as:

```json
{
  "eventId": "evt-example-001",
  "eventType": "book.completed",
  "occurredAt": "timestamp",
  "payload": {}
}
```

Consumers track processed event IDs.

If the same event is received again, it is ignored instead of producing duplicate side effects.

This prevents issues such as:

- duplicate achievements,
- duplicated notifications,
- incorrect challenge progress,
- repeated recommendation activity.

---

# 🧯 Fault Isolation & Graceful Degradation

Microservices introduce network and service failures that do not exist in the same way inside a monolithic application.

Bookend is designed so that failure of a non-core service does not necessarily make the entire platform unavailable.

For example, if the Recommendation Service is temporarily unavailable:

```text
Authentication        ✅
Book Discovery        ✅
Personal Library      ✅
Ratings               ✅
StoryLab              ✅

NextRead              ⚠ Temporarily unavailable
ShelfMatch            ⚠ Temporarily unavailable
```

Similarly, asynchronous events can remain buffered by RabbitMQ until the relevant consumer becomes available again.

---

# ⚖️ Why Microservices?

Bookend intentionally uses microservices as a practical demonstration of distributed backend architecture.

The architecture provides several advantages.

### Independent Deployment

A change to the Recommendation Service does not necessarily require redeploying the Catalog or Identity services.

### Independent Scaling

Recommendation processing, social content, or reading traffic can theoretically scale according to their own workloads.

### Fault Isolation

A failure in recommendation processing does not have to prevent users from browsing books or managing their libraries.

### Technology Flexibility

Most backend services use Node.js/Express while recommendation processing uses Python/FastAPI.

### Clear Business Boundaries

Each service owns a cohesive business capability instead of splitting the system by arbitrary API endpoints.

---

# 💰 Operational Cost & Trade-Offs

Microservices are **not automatically better than a monolith**.

For a small application maintained by one developer, a modular monolith could be simpler.

Bookend's microservices architecture introduces additional operational concerns:

- multiple independently running services,
- network communication,
- RabbitMQ infrastructure,
- service configuration,
- distributed debugging,
- event consistency,
- idempotency,
- multiple data ownership boundaries,
- health monitoring,
- container orchestration.

Bookend therefore demonstrates the central microservices trade-off:

> **Service independence comes at the cost of additional operational complexity.**

The architecture is intentionally used to explore and demonstrate these trade-offs rather than to suggest that every application should use microservices.

---

# 🛠️ Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Node.js
- Express.js
- Python
- FastAPI

## Messaging

- RabbitMQ
- AMQP

## Data

- Isolated service storage
- SQLite for standalone/local development

## Authentication

- JWT-based authentication

## Infrastructure

- Docker
- Docker Compose

## Testing

- JavaScript integration tests
- Python recommendation-engine tests

---

# 🚀 Running Bookend

Bookend supports two execution modes.

---

## Option 1 — Docker Compose

This is the easiest way to run the complete distributed architecture together.

Make sure Docker Desktop is running.

From the project root:

```bash
docker compose up --build
```

After the images have already been built, normal startup can usually use:

```bash
docker compose up
```

The environment exposes:

| Component | Address |
|---|---|
| Frontend | `http://localhost:3000` |
| API Gateway | `http://localhost:4000` |
| Identity Service | `http://localhost:4001` |
| Catalog & Reading Service | `http://localhost:4002` |
| Social Service | `http://localhost:4003` |
| Recommendation Service | `http://localhost:4004` |
| Engagement Service | `http://localhost:4005` |
| RabbitMQ | `localhost:5672` |
| RabbitMQ Management | `http://localhost:15672` |

RabbitMQ local development credentials:

```text
guest / guest
```

To stop the running environment:

```text
Ctrl + C
```

or:

```bash
docker compose down
```

---

## Option 2 — Standalone Local Development

For debugging or development, the services can also be started individually.

### Seed local service databases

```bash
npm run seed:all
```

### Run tests

```bash
npm test
```

### Start each service in a separate terminal

```bash
npm run dev:gateway
```

```bash
npm run dev:identity
```

```bash
npm run dev:catalog
```

```bash
npm run dev:social
```

```bash
npm run dev:recommendation
```

```bash
npm run dev:engagement
```

```bash
npm run dev:frontend
```

Then open:

```text
http://localhost:3000
```

> Do not run the standalone services and Docker Compose versions simultaneously on the same ports.

---

# 🎭 Demonstration Flow

A useful end-to-end demonstration of Bookend's architecture is:

### 1. Open Bookend

Navigate to:

```text
http://localhost:3000
```

### 2. Browse Books

Open the Books section.

The request flows through:

```text
Frontend
   ↓
API Gateway
   ↓
Catalog & Reading Service
```

### 3. Open Dune

View:

- book information,
- reading status,
- adaptations,
- community content.

### 4. Explore Page to Screen

View the screen adaptations associated with *Dune*.

### 5. Add Dune to the Personal Library

Move it to **Currently Reading**.

### 6. Complete the Book

Update reading progress to completion.

The Catalog & Reading Service persists the change and publishes:

```text
book.completed
```

### 7. Observe the Event Flow

```text
Catalog Service
      ↓
book.completed
      ↓
RabbitMQ
   ↙       ↘
Recommendation   Engagement
   Service        Service
```

### 8. Open NextRead

The Recommendation Service can update the reader's taste profile and provide relevant suggestions.

### 9. Open ReadQuest

The Engagement Service processes reading activity and updates challenge or achievement progress.

### 10. Open ShelfMatch

View compatible readers based on reading preferences and ratings.

### 11. Open StoryLab

Browse community-created:

- theories,
- alternate endings,
- sequel concepts,
- adaptation pitches.

### 12. Publish StoryLab Content

Publishing content can generate:

```text
story.published
```

which is distributed asynchronously to interested consumers.

---

# 🧪 Testing & Verification

Run:

```bash
npm test
```

The repository includes tests covering important backend behavior.

### Event-Driven Integration Tests

`tests/integration-event-flow.test.js`

Verifies:

- `book.completed` event handling,
- achievement unlocking,
- challenge progression,
- duplicate-event protection.

The duplicate event test confirms that processing the same event ID twice does not duplicate counters or notifications.

### Recommendation Tests

`services/recommendation-service/tests/test_engine.py`

Covers:

- cosine similarity,
- user taste vectors,
- explainable recommendation output,
- ShelfMatch compatibility scoring.

---

# 📂 Project Structure

```text
bookend/
│
├── frontend/
│   └── React + TypeScript application
│
├── services/
│   ├── api-gateway/
│   ├── identity-service/
│   ├── catalog-reading-service/
│   ├── social-service/
│   ├── recommendation-service/
│   └── engagement-service/
│
├── scripts/
│   └── seed-all.js
│
├── tests/
│   ├── integration-event-flow.test.js
│   └── run-all-tests.js
│
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── .gitignore
├── MICROSERVICES_ARCHITECTURE.md
├── package.json
└── README.md
```

---

# 🩺 Service Health

Each service exposes a health endpoint.

The application architecture view can use these endpoints to verify whether individual services are available.

This helps demonstrate an important property of distributed systems: individual components can have independent health states.

---

# 🎓 Microservices Concepts Demonstrated

Bookend provides practical examples of:

- decomposition by business capability,
- high cohesion,
- low coupling,
- independent services,
- API Gateway pattern,
- synchronous REST communication,
- asynchronous messaging,
- RabbitMQ,
- domain events,
- event-driven architecture,
- idempotent consumers,
- eventual consistency,
- fault isolation,
- graceful degradation,
- technology heterogeneity,
- service-owned data,
- containerization,
- Docker Compose orchestration.

---

# 💬 Architecture Discussion Points

## Why not simply use a monolith?

For a small version of Bookend, a modular monolith would likely be simpler.

Microservices were intentionally selected here to explore independent service boundaries, event-driven communication, fault isolation, and technology flexibility.

---

## Why use RabbitMQ instead of REST everywhere?

REST is appropriate when the caller requires an immediate response.

For example:

```text
Search book → return book
```

But completing a book represents an event that several independent systems may react to:

```text
book.completed
      ↓
Recommendation
Engagement
Notifications
Analytics (future)
```

The Catalog Service should not need direct knowledge of every downstream consumer.

---

## How are duplicate events handled?

Consumers process events idempotently using event IDs.

If an event has already been processed, receiving it again does not repeat its side effects.

---

## What happens if Recommendation Service crashes?

Core functionality remains available.

Users can continue:

- authenticating,
- browsing books,
- updating their libraries,
- reviewing books,
- accessing StoryLab.

Recommendation-related functionality can recover independently.

---

## Why use Python for only one service?

The Recommendation Service performs similarity and vector-based recommendation calculations.

Because it is independently deployed, it can use Python/FastAPI while other services use Node.js/Express.

This demonstrates one advantage of microservices: **technology choices can be made per workload rather than for the entire application.**

---

# 🔮 Future Improvements

Potential future work includes:

- distributed tracing with OpenTelemetry,
- centralized structured logging,
- Redis caching,
- stronger production database infrastructure,
- recommendation model evaluation,
- CI/CD pipelines,
- cloud deployment,
- improved secret management,
- load and performance testing,
- dead-letter queues,
- more advanced retry policies,
- service metrics and dashboards.

These are intentionally presented as future improvements rather than claiming they already exist.

---

# 📖 Additional Architecture Documentation

For a deeper discussion of service boundaries, event flows, communication choices, idempotency, and architectural trade-offs, see:

**`MICROSERVICES_ARCHITECTURE.md`**

---

## 📌 Project Purpose

Bookend was built as both a functional social reading platform and a practical exploration of distributed backend architecture.

The project focuses on an important architectural lesson:

> **Microservices are not about creating the maximum number of services. They are about identifying meaningful business boundaries and deciding whether the independence those boundaries provide is worth the additional operational complexity.**

---

*Built as a Backend Development and distributed-systems project.*
