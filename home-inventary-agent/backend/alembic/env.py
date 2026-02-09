import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from alembic import context
import os
import sys

# Make backend importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.config import settings
from core.db import engine, Base

# Import models so metadata is registered
import models.schema  # noqa

config = context.config
fileConfig(config.config_file_name)

# Use DB URL from settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

target_metadata = Base.metadata


def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online():
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
