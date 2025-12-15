from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.config import config
from src.di import Container
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

    kafka_producer = container.kafka_producer()
    await kafka_producer.start()
    yield
    await kafka_producer.stop()
    kafka_admin.close()


app = FastAPI(lifespan=lifespan)
container.wire(modules=["src.endpoints.events"])

app.include_router(events_router)
