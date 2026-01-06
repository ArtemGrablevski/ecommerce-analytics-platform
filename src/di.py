import asynch
from dependency_injector import containers, providers

from src.config import config
from src.repositories.clickhouse_repository import ClickHouseRepository
from src.services.dashboard.dashboard_service import DashboardService
from src.services.event_service import EventService
from src.services.kafka_producer import KafkaEventProducer


class Container(containers.DeclarativeContainer):
    clickhouse_connection = providers.Dependency()

    kafka_producer = providers.Singleton(KafkaEventProducer, bootstrap_servers=config.kafka_bootstrap_servers)

    event_service = providers.Factory(EventService, producer=kafka_producer)

    clickhouse_repository = providers.Singleton(ClickHouseRepository, connection=clickhouse_connection)

    dashboard_service = providers.Factory(DashboardService, clickhouse_repository=clickhouse_repository)
