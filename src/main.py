from contextlib import asynccontextmanager

import asynch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import config
from src.di import Container
from src.endpoints.dashboard import router as dashboard_router
from src.endpoints.events import router as events_router
from src.services.kafka_admin import KafkaAdminService

container = Container()


@asynccontextmanager
async def lifespan(app: FastAPI):
    kafka_admin = KafkaAdminService(
        kafka_brokers=config.kafka_brokers,
        kafka_topic_partitions=config.kafka_topic_partitions,
        kafka_replication_factor=config.kafka_replication_factor,
    )
    await kafka_admin.ensure_topics_exist()

    clickhouse_connection = await asynch.connect(
        host=config.clickhouse_host,
        port=config.clickhouse_port,
        database=config.clickhouse_database,
        user=config.clickhouse_user,
        password=config.clickhouse_password,
    )

    container.clickhouse_connection.override(clickhouse_connection)

    kafka_producer = container.kafka_producer()
    await kafka_producer.start()
    yield
    await kafka_producer.stop()
    await clickhouse_connection.close()
    kafka_admin.close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

container.wire(modules=["src.endpoints.events", "src.endpoints.dashboard"])

app.include_router(events_router)
app.include_router(dashboard_router)
