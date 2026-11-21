from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import datetime
from app.config import SERVICE_NAME, PORT
from app.db import init_db
from app.events import start_rabbitmq_consumer
from app.routes import router

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s")
logger = logging.getLogger("recommendation_service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Recommendation Service Database...")
    init_db()
    logger.info("Starting RabbitMQ background consumer...")
    start_rabbitmq_consumer()
    yield
    logger.info("Recommendation Service shutting down.")

app = FastAPI(
    title="Bookend Recommendation Service",
    description="NextRead personalized recommendation engine and ShelfMatch reader compatibility calculator",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": SERVICE_NAME,
        "port": PORT,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

# Mount routes under /api
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
