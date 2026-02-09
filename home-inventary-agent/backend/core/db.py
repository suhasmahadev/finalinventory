# backend/core/db.py

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData
from typing import AsyncGenerator

from core.config import settings


# -------------------------------------------------------
# Naming Convention (Prevents Alembic Constraint Issues)
# -------------------------------------------------------

naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=naming_convention)


# -------------------------------------------------------
# Declarative Base
# -------------------------------------------------------

class Base(DeclarativeBase):
    metadata = metadata


# -------------------------------------------------------
# Async Engine
# -------------------------------------------------------

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
)


# -------------------------------------------------------
# Async Session Maker (STANDARD NAME)
# -------------------------------------------------------

async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# -------------------------------------------------------
# FastAPI Dependency
# -------------------------------------------------------

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


# -------------------------------------------------------
# Internal Session Context (Agent / Tools)
# -------------------------------------------------------

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


# -------------------------------------------------------
# Optional DB Connectivity Test
# -------------------------------------------------------

async def test_connection():
    async with engine.begin() as conn:
        await conn.run_sync(lambda _: None)


# Ensure models are imported so Alembic sees metadata
import models.schema  # noqa
