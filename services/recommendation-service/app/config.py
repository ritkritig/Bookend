import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent.parent

# Try to load .env using python-dotenv or built-in manual parser
try:
    from dotenv import load_dotenv
    load_dotenv(ROOT_DIR / ".env")
    load_dotenv(BASE_DIR / ".env")
except ImportError:
    # Built-in fallback parser for .env
    for env_file in [ROOT_DIR / ".env", BASE_DIR / ".env"]:
        if env_file.exists():
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k, v = k.strip(), v.strip().strip("'").strip('"')
                        if k not in os.environ:
                            os.environ[k] = v

port_env = os.getenv("RECOMMENDATION_PORT", os.getenv("PORT", "4004"))
PORT = int(port_env) if port_env != "4000" else 4004

SERVICE_NAME = "recommendation-service"
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672")
EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "bookend.events")
QUEUE_NAME = os.getenv("RECOMMENDATION_QUEUE", "recommendation-events-queue")

DB_PATH = os.getenv("DB_PATH", str(BASE_DIR / "data" / "recommendations.db"))

CATALOG_SERVICE_URL = os.getenv("CATALOG_SERVICE_URL", "http://localhost:4002")
IDENTITY_SERVICE_URL = os.getenv("IDENTITY_SERVICE_URL", "http://localhost:4001")
