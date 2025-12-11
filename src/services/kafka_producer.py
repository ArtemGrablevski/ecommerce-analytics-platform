import json
from abc import ABC, abstractmethod
from typing import Any

from aiokafka import AIOKafkaProducer


class EventProducerInterface(ABC):
    @abstractmethod
    async def send_event(self, topic: str, event: dict[str, Any]) -> None:
        pass


class KafkaEventProducer(EventProducerInterface):
    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self.bootstrap_servers = bootstrap_servers
        self.producer: AIOKafkaProducer | None = None

    async def start(self) -> None:
        self.producer = AIOKafkaProducer(
            bootstrap_servers=self.bootstrap_servers, value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )
        await self.producer.start()

    async def stop(self) -> None:
        if self.producer:
            await self.producer.stop()

    async def send_event(self, topic: str, event: dict[str, Any]) -> None:
        if not self.producer:
            raise RuntimeError("Producer not started")
        await self.producer.send(topic, event)
