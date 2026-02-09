# backend/core/config.py

from pydantic_settings import BaseSettings
from typing import Optional

from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    
    # =========================
    # APP
    # =========================
    ENV: str = "development"
    APP_NAME: str = "inventory-agent"
    DEBUG: bool = True
    SECRET_KEY: str = "change_this"

    # =========================
    # POSTGRES
    # =========================
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "1234567890"
    POSTGRES_DB: str = "inventory_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # =========================
    # AI / LLM
    # =========================
    LLM_PROVIDER: str = "google"
    GOOGLE_GENAI_USE_VERTEXAI: bool = False
    GOOGLE_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    MODEL_NAME: str = "gemini-1.5-pro"

    # =========================
    # TWILIO
    # =========================
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_FROM_NUMBER: Optional[str] = None

    # =========================
    # IOT
    # =========================
    IOT_ENABLED: bool = False
    IOT_API_KEY: Optional[str] = None
    IOT_INGEST_SECRET: Optional[str] = None
    
    # =========================
# SMTP
# =========================
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM: Optional[str] = None

    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None
    # =========================
    # REDIS
    # =========================
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"

    # =========================
    # ML
    # =========================
    FORECAST_ENABLED: bool = True
    FORECAST_MODEL_PATH: str = "models/"
    FORECAST_WINDOW_DAYS: int = 30

    # =========================
    # LOGGING
    # =========================
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    # 🔥 Dynamically build DATABASE_URL
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://"
            f"{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_HOST}:"
            f"{self.POSTGRES_PORT}/"
            f"{self.POSTGRES_DB}"
        )
        


settings = Settings()
