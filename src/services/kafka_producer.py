import json
from abc import ABC, abstractmethod

from aiokafka import AIOKafkaProducer


class EventProducerInterface(ABC):
    @abstractmethod
    async def send_event(self, topic: str, event: dict[str, object]) -> None:
        pass


class KafkaEventProducer(EventProducerInterface):
    def __init__(self, bootstrap_servers: str):
        self.bootstrap_servers = bootstrap_servers
        self.producer: AIOKafkaProducer | None = None

    def _serialize_value(self, value: object) -> bytes:
        return json.dumps(value).encode("utf-8")

    async def start(self) -> None:
        self.producer = AIOKafkaProducer(
            bootstrap_servers=self.bootstrap_servers, value_serializer=self._serialize_value
        )
        await self.producer.start()

    async def stop(self) -> None:
        if self.producer:
            await self.producer.stop()

    async def send_event(self, topic: str, event: dict[str, object]) -> None:
        if not self.producer:
            raise RuntimeError("Producer not started")
        topic_name = topic.value if hasattr(topic, "value") else str(topic)
        await self.producer.send(topic_name, event)
