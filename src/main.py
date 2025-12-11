from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.di import Container
from src.endpoints import events_router

container = Container()


@asynccontextmanager
async def lifespan(app: FastAPI):
    kafka_producer = container.kafka_producer()
    await kafka_producer.start()
    yield
    await kafka_producer.stop()


app = FastAPI(lifespan=lifespan)
container.wire(packages=["src.endpoints"])

app.include_router(events_router)
