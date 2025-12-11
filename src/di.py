from dependency_injector import containers, providers

from src.services.event_service import EventService
from src.services.kafka_producer import KafkaEventProducer


class Container(containers.DeclarativeContainer):
    kafka_producer = providers.Singleton(KafkaEventProducer, bootstrap_servers="localhost:9092")

    event_service = providers.Factory(EventService, producer=kafka_producer)
