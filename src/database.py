from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.config import config


def get_database_url() -> str:
    return f"postgresql+asyncpg://{config.postgres_user}:{config.postgres_password}@{config.postgres_host}:{config.postgres_port}/{config.postgres_db}"


engine = create_async_engine(get_database_url())
session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
